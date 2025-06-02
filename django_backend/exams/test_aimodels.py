from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from django_backend.exams.models import AIModel

User = get_user_model()

class AIModelViewSetTests(APITestCase):
    def setUp(self):
        # Create an admin user
        self.admin_user = User.objects.create_user(
            name="Admin User",
            email="admin@example.com",
            password="adminpassword",
            role="admin"
        )
        self.admin_user.is_staff = True # For admin panel access, often useful
        self.admin_user.save()

        # Create a regular user
        self.regular_user = User.objects.create_user(
            name="Regular User",
            email="user@example.com",
            password="userpassword",
            role="student"
        )

        # AI Model data
        self.ai_model_data = {
            "name": "Test AI Model",
            "api_key": "test_api_key_123",
            "model_identifier": "test-model-v1",
            "is_active": True
        }
        self.ai_model_updated_data = {
            "name": "Updated Test AI Model",
            "api_key": "updated_api_key_456",
            "model_identifier": "test-model-v2",
            "is_active": False
        }
        
        # URLs
        self.list_create_url = reverse("aimodel-list") # Make sure your router is registered with basename 'aimodel'

    # Helper to get detail URL
    def get_detail_url(self, model_id):
        return reverse("aimodel-detail", kwargs={"pk": model_id})

    # === Test Authentication/Permissions ===

    def test_non_admin_cannot_list_ai_models(self):
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_non_admin_cannot_create_ai_model(self):
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.post(self.list_create_url, self.ai_model_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_non_admin_cannot_retrieve_ai_model(self):
        # First, create a model as admin to have one to retrieve
        self.client.force_authenticate(user=self.admin_user)
        create_response = self.client.post(self.list_create_url, self.ai_model_data, format="json")
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
        model_id = create_response.data["id"]
        
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get(self.get_detail_url(model_id))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_non_admin_cannot_update_ai_model(self):
        self.client.force_authenticate(user=self.admin_user)
        create_response = self.client.post(self.list_create_url, self.ai_model_data, format="json")
        model_id = create_response.data["id"]

        self.client.force_authenticate(user=self.regular_user)
        response = self.client.put(self.get_detail_url(model_id), self.ai_model_updated_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_non_admin_cannot_delete_ai_model(self):
        self.client.force_authenticate(user=self.admin_user)
        create_response = self.client.post(self.list_create_url, self.ai_model_data, format="json")
        model_id = create_response.data["id"]

        self.client.force_authenticate(user=self.regular_user)
        response = self.client.delete(self.get_detail_url(model_id))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # === Test CRUD Operations (as admin) ===

    def test_admin_can_create_ai_model(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post(self.list_create_url, self.ai_model_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], self.ai_model_data["name"])
        self.assertEqual(response.data["model_identifier"], self.ai_model_data["model_identifier"])
        self.assertEqual(response.data["is_active"], self.ai_model_data["is_active"])
        self.assertNotIn("api_key", response.data) # API key should not be in response
        self.assertTrue(AIModel.objects.filter(id=response.data["id"]).exists())
        # Verify stored API key
        created_model = AIModel.objects.get(id=response.data["id"])
        self.assertEqual(created_model.api_key, self.ai_model_data["api_key"])


    def test_admin_can_list_ai_models(self):
        self.client.force_authenticate(user=self.admin_user)
        # Create a couple of models
        self.client.post(self.list_create_url, self.ai_model_data, format="json")
        data2 = self.ai_model_data.copy()
        data2["name"] = "Test Model 2"
        data2["model_identifier"] = "test-v2"
        self.client.post(self.list_create_url, data2, format="json")

        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        for model_data in response.data:
            self.assertNotIn("api_key", model_data)

    def test_admin_can_retrieve_ai_model(self):
        self.client.force_authenticate(user=self.admin_user)
        create_response = self.client.post(self.list_create_url, self.ai_model_data, format="json")
        model_id = create_response.data["id"]

        response = self.client.get(self.get_detail_url(model_id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], self.ai_model_data["name"])
        self.assertNotIn("api_key", response.data)

    def test_admin_can_update_ai_model_put(self):
        self.client.force_authenticate(user=self.admin_user)
        create_response = self.client.post(self.list_create_url, self.ai_model_data, format="json")
        model_id = create_response.data["id"]

        response = self.client.put(self.get_detail_url(model_id), self.ai_model_updated_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], self.ai_model_updated_data["name"])
        self.assertEqual(response.data["model_identifier"], self.ai_model_updated_data["model_identifier"])
        self.assertEqual(response.data["is_active"], self.ai_model_updated_data["is_active"])
        self.assertNotIn("api_key", response.data)
        
        # Verify stored API key was updated
        updated_model = AIModel.objects.get(id=model_id)
        self.assertEqual(updated_model.api_key, self.ai_model_updated_data["api_key"])

    def test_admin_can_update_ai_model_patch_partial(self):
        self.client.force_authenticate(user=self.admin_user)
        create_response = self.client.post(self.list_create_url, self.ai_model_data, format="json")
        model_id = create_response.data["id"]

        patch_data = {"name": "Patched Name Only", "api_key": "patched_api_key"}
        response = self.client.patch(self.get_detail_url(model_id), patch_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], patch_data["name"])
        self.assertEqual(response.data["model_identifier"], self.ai_model_data["model_identifier"]) # Original
        self.assertNotIn("api_key", response.data)

        # Verify stored API key was updated
        updated_model = AIModel.objects.get(id=model_id)
        self.assertEqual(updated_model.api_key, patch_data["api_key"])
        self.assertEqual(updated_model.name, patch_data["name"])


    def test_admin_can_update_ai_model_without_sending_api_key(self):
        self.client.force_authenticate(user=self.admin_user)
        create_response = self.client.post(self.list_create_url, self.ai_model_data, format="json")
        model_id = create_response.data["id"]
        original_api_key = AIModel.objects.get(id=model_id).api_key

        update_data_no_key = {
            "name": "Updated Name No Key Change",
            "model_identifier": "test-model-v1-updated-identifier", # Changed
            "is_active": False
        }
        response = self.client.put(self.get_detail_url(model_id), update_data_no_key, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], update_data_no_key["name"])
        self.assertEqual(response.data["model_identifier"], update_data_no_key["model_identifier"])
        
        # Verify stored API key was NOT changed
        updated_model = AIModel.objects.get(id=model_id)
        self.assertEqual(updated_model.api_key, original_api_key)


    def test_admin_can_delete_ai_model(self):
        self.client.force_authenticate(user=self.admin_user)
        create_response = self.client.post(self.list_create_url, self.ai_model_data, format="json")
        model_id = create_response.data["id"]

        response = self.client.delete(self.get_detail_url(model_id))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(AIModel.objects.filter(id=model_id).exists())

    def test_api_key_not_in_list_response(self):
        self.client.force_authenticate(user=self.admin_user)
        self.client.post(self.list_create_url, self.ai_model_data, format="json")
        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)
        for item in response.data:
            self.assertNotIn("api_key", item)

    def test_api_key_not_in_retrieve_response(self):
        self.client.force_authenticate(user=self.admin_user)
        create_response = self.client.post(self.list_create_url, self.ai_model_data, format="json")
        model_id = create_response.data["id"]
        response = self.client.get(self.get_detail_url(model_id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotIn("api_key", response.data)

    def test_create_ai_model_with_missing_fields(self):
        self.client.force_authenticate(user=self.admin_user)
        incomplete_data = {"name": "Incomplete Model"}
        response = self.client.post(self.list_create_url, incomplete_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("api_key", response.data)
        self.assertIn("model_identifier", response.data)
