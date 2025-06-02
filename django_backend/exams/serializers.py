from  rest_framework import serializers
from .models import Exam, ExamQuestion, AIModel
from questions.serializers import QuestionSerializer
from django.utils import timezone
import random
from questions.models import Question, Option

class ExamQuestionSerializer(serializers.ModelSerializer):
    question = QuestionSerializer()
    
    class Meta:
        model = ExamQuestion
        fields = ['id', 'question', 'order', 'user_answer', 'is_correct']


class ExamSerializer(serializers.ModelSerializer):
    questions = ExamQuestionSerializer(source='examquestion_set', many=True, read_only=True)
    ai_model = AIModelSerializer(read_only=True) # Added AIModelSerializer

    class Meta:
        model = Exam
        fields = [
            'id', 'title', 'specialization', 'questions', 'question_count',
            'time_limit', 'start_time', 'end_time', 'status', 'score',
            'correct_answers', 'percentage', 'created_at', 'exam_type', # Added exam_type
            'ai_model_id', 'ai_model' # Added ai_model_id and ai_model
        ]
        read_only_fields = ['id', 'title', 'start_time', 'end_time', 'status', 
                            'score', 'correct_answers', 'percentage', 'created_at', 'ai_model']
        extra_kwargs = {
            'ai_model_id': {'write_only': True, 'required': False, 'allow_null': True}
        }


class ExamStartSerializer(serializers.Serializer):
    specialization = serializers.ChoiceField(choices=Exam.SPECIALIZATION_CHOICES)
    question_count = serializers.IntegerField(min_value=5, max_value=30)
    ai_model_id = serializers.IntegerField(required=False, allow_null=True) # Added ai_model_id


class ExamSubmissionSerializer(serializers.Serializer):
    answers = serializers.ListField(
        child=serializers.IntegerField(min_value=-1),
        allow_empty=False
    )

    def validate_answers(self, value):
        # التحقق من أن عدد الإجابات المقدمة يساوي عدد الأسئلة في الامتحان
        exam = self.context['exam']
        if len(value) != exam.question_count:
            raise serializers.ValidationError(
                f"يجب تقديم {exam.question_count} إجابة، تم تقديم {len(value)} فقط."
            )
        return value


class ExamListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = [
            'id', 'title', 'specialization', 'question_count', 'status',
            'score', 'correct_answers', 'percentage', 'created_at',
            'exam_type', 'ai_model'
        ]

class AIModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIModel
        fields = ['id', 'name', 'api_key', 'model_identifier', 'is_active']
        extra_kwargs = {
            'api_key': {'write_only': True}
        }
 