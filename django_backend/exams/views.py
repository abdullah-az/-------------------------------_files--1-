from  rest_framework import viewsets, generics, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Max
import random

from .models import Exam, ExamQuestion
from .serializers import (
    ExamSerializer, ExamStartSerializer, 
    ExamSubmissionSerializer, ExamListSerializer, AIModelSerializer
)
from questions.models import Question, Option
from .models import AIModel

class ExamViewSet(viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Exam.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def start(self, request):
        serializer = ExamStartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        specialization = serializer.validated_data['specialization']
        question_count = serializer.validated_data['question_count']
        
        # الحصول على الأسئلة العشوائية من التخصص المطلوب
        questions = list(Question.objects.filter(specialization=specialization))
        
        if len(questions) < question_count:
            return Response(
                {"error": f"عدد الأسئلة المتاحة ({len(questions)}) أقل من العدد المطلوب ({question_count})."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # اختيار أسئلة عشوائية
        selected_questions = random.sample(questions, question_count)
        
        # إنشاء امتحان جديد
        title_map = dict(Exam.SPECIALIZATION_CHOICES)
        exam = Exam.objects.create(
            user=request.user,
            title=f"امتحان {title_map[specialization]}",
            specialization=specialization,
            question_count=question_count,
            time_limit=int(question_count * 1.5)  # وقت تقريبي: 1.5 دقيقة لكل سؤال
        )
        
        # إضافة الأسئلة للامتحان
        for i, question in enumerate(selected_questions):
            ExamQuestion.objects.create(
                exam=exam,
                question=question,
                order=i
            )
        
        # إرجاع بيانات الامتحان
        return Response(ExamSerializer(exam).data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['post'], url_path='start-ai')
    def start_ai(self, request):
        """بدء امتحان ذكي باستخدام الذكاء الاصطناعي"""
        serializer = ExamStartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        specialization = serializer.validated_data['specialization']
        question_count = serializer.validated_data['question_count']
        ai_model_id = serializer.validated_data.get('ai_model_id')

        if not ai_model_id:
            return Response(
                {"error": "ai_model_id is required for AI exams."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            ai_model_instance = AIModel.objects.get(pk=ai_model_id)
        except AIModel.DoesNotExist:
            return Response(
                {"error": f"AIModel with id {ai_model_id} not found."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Generate questions using the AI model (placeholder logic)
        selected_questions = self._generate_questions_via_ai(ai_model_instance, specialization, question_count)
        
        # إنشاء امتحان جديد
        title_map = dict(Exam.SPECIALIZATION_CHOICES)
        exam = Exam.objects.create(
            user=request.user,
            title=f"امتحان ذكي - {title_map[specialization]} (AI: {ai_model_instance.name})",
            specialization=specialization,
            question_count=question_count,
            time_limit=int(question_count * 1.5),  # وقت تقريبي: 1.5 دقيقة لكل سؤال
            exam_type='ai',  # تحديد نوع الامتحان كذكي
            ai_model=ai_model_instance # Link the AI model
        )
        
        # إضافة الأسئلة للامتحان
        for i, question in enumerate(selected_questions):
            ExamQuestion.objects.create(
                exam=exam,
                question=question,
                order=i
            )
        
        # إرجاع بيانات الامتحان
        return Response(ExamSerializer(exam).data, status=status.HTTP_201_CREATED)
    
    # def _select_ai_questions(self, questions, count):
    #     """اختيار ذكي للأسئلة بناءً على التنوع والصعوبة"""
    #     # تصنيف الأسئلة حسب الصعوبة
    #     easy_questions = [q for q in questions if q.difficulty == 'easy']
    #     medium_questions = [q for q in questions if q.difficulty == 'medium']
    #     hard_questions = [q for q in questions if q.difficulty == 'hard']
        
    #     selected = []
        
    #     # توزيع الأسئلة: 40% سهل، 40% متوسط، 20% صعب
    #     easy_count = int(count * 0.4)
    #     medium_count = int(count * 0.4)
    #     hard_count = count - easy_count - medium_count
        
    #     # اختيار الأسئلة السهلة
    #     if easy_questions and easy_count > 0:
    #         selected.extend(random.sample(easy_questions, min(easy_count, len(easy_questions))))
        
    #     # اختيار الأسئلة المتوسطة
    #     if medium_questions and medium_count > 0:
    #         selected.extend(random.sample(medium_questions, min(medium_count, len(medium_questions))))
        
    #     # اختيار الأسئلة الصعبة
    #     if hard_questions and hard_count > 0:
    #         selected.extend(random.sample(hard_questions, min(hard_count, len(hard_questions))))
        
    #     # إذا لم نحصل على العدد المطلوب، أكمل من الأسئلة المتبقية
    #     if len(selected) < count:
    #         remaining_questions = [q for q in questions if q not in selected]
    #         needed = count - len(selected)
    #         if remaining_questions:
    #             selected.extend(random.sample(remaining_questions, min(needed, len(remaining_questions))))
        
    #     return selected[:count]

    def _generate_questions_via_ai(self, ai_model, specialization, question_count):
        """Simulates AI question generation."""
        new_questions = []
        current_year = str(timezone.now().year)
        for i in range(question_count):
            question_text = f"AI Generated Question for {specialization} ({ai_model.name}) - {i+1}"
            question = Question.objects.create(
                text=question_text,
                specialization=specialization,
                year=current_year,
                marks=1,
                difficulty='medium' # Default for AI generated
            )
            
            # Create 2-4 options for the question
            num_options = random.randint(2, 4)
            for j in range(num_options):
                Option.objects.create(
                    question=question,
                    text=f"Option {j+1} for AI Question {i+1}",
                    is_correct=(j == 0) # First option is correct (placeholder)
                )
            new_questions.append(question)
        return new_questions
    
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        exam = self.get_object()
        
        # التحقق من أن الامتحان لم ينتهي بعد
        if exam.status != 'ongoing':
            return Response(
                {"error": "لا يمكن تقديم امتحان منتهي."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = ExamSubmissionSerializer(data=request.data, context={'exam': exam})
        serializer.is_valid(raise_exception=True)
        
        answers = serializer.validated_data['answers']
        
        # تخزين إجابات المستخدم وحساب النتيجة
        exam_questions = exam.examquestion_set.all().order_by('order')
        correct_count = 0
        total_marks = 0
        
        for i, exam_question in enumerate(exam_questions):
            user_answer = answers[i]
            exam_question.user_answer = user_answer
            
            # الحصول على الإجابة الصحيحة
            options = exam_question.question.options.all()
            correct_index = -1
            for j, option in enumerate(options):
                if option.is_correct:
                    correct_index = j
                    break
            
            # تحديد ما إذا كانت الإجابة صحيحة
            exam_question.is_correct = (user_answer == correct_index)
            exam_question.save()
            
            if exam_question.is_correct:
                correct_count += 1
                total_marks += exam_question.question.marks
        
        # تحديث حالة الامتحان ونتيجته
        exam.end_time = timezone.now()
        exam.status = 'completed'
        exam.correct_answers = correct_count
        exam.score = total_marks
        exam.percentage = (correct_count / exam.question_count) * 100
        exam.save()
        
        # إرجاع نتائج الامتحان
        return Response(ExamSerializer(exam).data)
    
    @action(detail=False, methods=['get'])
    def history(self, request):
        exams = self.get_queryset().filter(status='completed')
        serializer = ExamListSerializer(exams, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def result(self, request, pk=None):
        exam = self.get_object()
        
        # التحقق من أن المستخدم قد أكمل الامتحان
        if exam.status != 'completed':
            return Response(
                {"error": "لم يتم إكمال الامتحان بعد."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = ExamSerializer(exam)
        return Response(serializer.data)


class AIModelViewSet(viewsets.ModelViewSet):
    queryset = AIModel.objects.all()
    serializer_class = AIModelSerializer
    permission_classes = [permissions.IsAdminUser]
 