from  rest_framework import serializers
from .models import Topic, Resource, Quiz
from questions.serializers import QuestionSerializer

class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ['id', 'title', 'description', 'specialization']


class ResourceSerializer(serializers.ModelSerializer):
    topic_title = serializers.CharField(source='topic.title', read_only=True)
    
    class Meta:
        model = Resource
        fields = [
            'id', 'title', 'description', 'type', 'specialization', 
            'topic', 'topic_title', 'url', 'content', 'created_at'
        ]


class QuizDetailSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'specialization', 'questions']


class QuizListSerializer(serializers.ModelSerializer):
    question_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'specialization', 'question_count']
    
    def get_question_count(self, obj):
        return obj.questions.count()


class QuizSubmissionSerializer(serializers.Serializer):
    answers = serializers.ListField(
        child=serializers.IntegerField(min_value=-1),
        allow_empty=False
    )

    def validate_answers(self, value):
        # التحقق من أن عدد الإجابات المقدمة يساوي عدد الأسئلة في الاختبار
        quiz = self.context['quiz']
        question_count = quiz.questions.count()
        if len(value) != question_count:
            raise serializers.ValidationError(
                f"يجب تقديم {question_count} إجابة، تم تقديم {len(value)} فقط."
            )
        return value


class QuizResultSerializer(serializers.Serializer):
    quiz = QuizListSerializer()
    score = serializers.IntegerField()
    correct_count = serializers.IntegerField()
    total_count = serializers.IntegerField()
    percentage = serializers.FloatField()
    results = serializers.ListField(child=serializers.DictField())
 