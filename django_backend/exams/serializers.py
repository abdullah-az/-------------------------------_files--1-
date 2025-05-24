from  rest_framework import serializers
from .models import Exam, ExamQuestion
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
    
    class Meta:
        model = Exam
        fields = [
            'id', 'title', 'specialization', 'questions', 'question_count',
            'time_limit', 'start_time', 'end_time', 'status', 'score',
            'correct_answers', 'percentage', 'created_at'
        ]
        read_only_fields = ['id', 'title', 'start_time', 'end_time', 'status', 
                            'score', 'correct_answers', 'percentage', 'created_at']


class ExamStartSerializer(serializers.Serializer):
    specialization = serializers.ChoiceField(choices=Exam.SPECIALIZATION_CHOICES)
    question_count = serializers.IntegerField(min_value=5, max_value=30)


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
            'score', 'correct_answers', 'percentage', 'created_at'
        ]
 