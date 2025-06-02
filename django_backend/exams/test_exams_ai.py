from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from django_backend.exams.models import AIModel, Exam, ExamQuestion, Question
from django_backend.questions.models import Option as QuestionOption # Renamed to avoid conflict

User = get_user_model()

class AIExamCreationTests(APITestCase):
    def setUp(self):
        # Create a regular user
        self.user = User.objects.create_user(
            name="Test User",
            email="testuser@example.com",
            password="testpassword",
            role="student"
        )
        self.client.force_authenticate(user=self.user)

        # Create an AI Model
        self.ai_model = AIModel.objects.create(
            name="Test AI Generator",
            api_key="fake_api_key_for_testing",
            model_identifier="gpt-test-001",
            is_active=True
        )
        
        # URLs
        self.start_ai_exam_url = reverse("exam-start-ai") # Basename 'exam', action 'start-ai'

        # Basic data for starting an AI exam
        self.ai_exam_data = {
            "specialization": "software",
            "question_count": 5, # Keep low for faster tests
            "ai_model_id": self.ai_model.id
        }

    def test_create_ai_exam_success(self):
        response = self.client.post(self.start_ai_exam_url, self.ai_exam_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        
        # Verify Exam object
        self.assertTrue(Exam.objects.filter(id=response.data["id"]).exists())
        created_exam = Exam.objects.get(id=response.data["id"])
        self.assertEqual(created_exam.exam_type, "ai")
        self.assertEqual(created_exam.ai_model, self.ai_model)
        self.assertEqual(created_exam.question_count, self.ai_exam_data["question_count"])
        self.assertEqual(created_exam.user, self.user)
        self.assertIn(self.ai_model.name, created_exam.title) # Check if AI model name is in title

        # Verify Question objects were created
        exam_questions_count = ExamQuestion.objects.filter(exam=created_exam).count()
        self.assertEqual(exam_questions_count, self.ai_exam_data["question_count"])

        # Verify placeholder question generation logic
        first_exam_question = ExamQuestion.objects.filter(exam=created_exam).first()
        self.assertIsNotNone(first_exam_question)
        question_instance = first_exam_question.question
        
        self.assertIn("AI Generated Question", question_instance.text)
        self.assertIn(self.ai_exam_data["specialization"], question_instance.text)
        self.assertIn(self.ai_model.name, question_instance.text)
        self.assertEqual(question_instance.difficulty, "medium") # Default difficulty
        self.assertEqual(question_instance.specialization, self.ai_exam_data["specialization"])
        
        # Verify options were created for the question
        options_count = QuestionOption.objects.filter(question=question_instance).count()
        self.assertTrue(2 <= options_count <= 4) # As per placeholder logic
        # Check if at least one option is marked as correct
        self.assertTrue(QuestionOption.objects.filter(question=question_instance, is_correct=True).exists())


    def test_create_ai_exam_missing_ai_model_id(self):
        data = self.ai_exam_data.copy()
        del data["ai_model_id"]
        response = self.client.post(self.start_ai_exam_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("ai_model_id is required", response.data.get("error", "").lower())

    def test_create_ai_exam_invalid_ai_model_id(self):
        data = self.ai_exam_data.copy()
        data["ai_model_id"] = 9999 # Non-existent ID
        response = self.client.post(self.start_ai_exam_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("not found", response.data.get("error", "").lower())

    def test_create_ai_exam_inactive_ai_model(self):
        self.ai_model.is_active = False
        self.ai_model.save()
        # Assuming your view or model manager for AIModel might filter active ones,
        # or the view explicitly checks. If not, this might still pass if not handled.
        # For this test, we'll assume the AIModel.objects.get in the view won't fail for inactive,
        # but a real implementation might add a check.
        # If the _generate_questions_via_ai or selection logic filters by is_active,
        # this test might need adjustment or the view logic needs to be more robust.
        # For now, we test if it CAN be created, then we'll test serializer output.
        
        response = self.client.post(self.start_ai_exam_url, self.ai_exam_data, format="json")
        # If the model must be active to be used, this should be 400.
        # If it can be linked but just not used for generation, it might be 201.
        # Based on current view logic (simple get), it will create.
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        created_exam = Exam.objects.get(id=response.data["id"])
        self.assertEqual(created_exam.ai_model, self.ai_model) # Linked, even if inactive


    def test_ai_exam_serializer_output(self):
        # Create an AI exam
        create_response = self.client.post(self.start_ai_exam_url, self.ai_exam_data, format="json")
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
        exam_id = create_response.data["id"]

        # Retrieve the exam (assuming a detail endpoint exists for exams)
        # We'll use the response from creation as it should use the same serializer
        exam_data = create_response.data 
        
        self.assertEqual(exam_data["exam_type"], "ai")
        self.assertIsNotNone(exam_data["ai_model"])
        self.assertEqual(exam_data["ai_model"]["id"], self.ai_model.id)
        self.assertEqual(exam_data["ai_model"]["name"], self.ai_model.name)
        self.assertEqual(exam_data["ai_model"]["model_identifier"], self.ai_model.model_identifier)
        self.assertEqual(exam_data["ai_model"]["is_active"], self.ai_model.is_active) # reflects current state
        self.assertNotIn("api_key", exam_data["ai_model"]) # Ensure API key is not in nested serializer

        # Test with an inactive model linked
        self.ai_model.is_active = False
        self.ai_model.save()
        
        # Re-create an exam with the now inactive model
        # (This assumes the view allows linking to inactive models, which current logic does)
        exam_data_inactive_model = {
            "specialization": "networks", # different spec to ensure new exam
            "question_count": 3,
            "ai_model_id": self.ai_model.id
        }
        create_response_inactive = self.client.post(self.start_ai_exam_url, exam_data_inactive_model, format="json")
        self.assertEqual(create_response_inactive.status_code, status.HTTP_201_CREATED, create_response_inactive.data)
        exam_data_retrieved_inactive = create_response_inactive.data

        self.assertEqual(exam_data_retrieved_inactive["ai_model"]["is_active"], False)
        self.assertEqual(exam_data_retrieved_inactive["ai_model"]["name"], self.ai_model.name)
        self.assertNotIn("api_key", exam_data_retrieved_inactive["ai_model"])

    def test_start_normal_exam_via_start_ai_url_fails_or_redirects(self):
        # The `start-ai` URL is specifically for AI exams.
        # Sending data that might imply a normal exam (e.g. missing ai_model_id)
        # should be handled as an error for this specific endpoint.
        data_without_ai_id = {
            "specialization": "software",
            "question_count": 5,
        }
        response = self.client.post(self.start_ai_exam_url, data_without_ai_id, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST) # Expecting error due to missing ai_model_id
        self.assertIn("ai_model_id is required", response.data.get("error", "").lower())

    # Test that the number of questions created matches question_count
    def test_ai_exam_question_count_matches_request(self):
        requested_question_count = 7
        custom_data = {
            "specialization": "general",
            "question_count": requested_question_count,
            "ai_model_id": self.ai_model.id
        }
        response = self.client.post(self.start_ai_exam_url, custom_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        exam_id = response.data["id"]
        created_exam = Exam.objects.get(id=exam_id)
        
        self.assertEqual(created_exam.question_count, requested_question_count)
        exam_questions_assoc_count = ExamQuestion.objects.filter(exam=created_exam).count()
        self.assertEqual(exam_questions_assoc_count, requested_question_count)

        # Also check the questions field in the response data
        self.assertEqual(len(response.data["questions"]), requested_question_count)
