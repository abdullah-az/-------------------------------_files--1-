from  rest_framework import viewsets, generics, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

from .models import Topic, Resource, Quiz
from .serializers import (
    TopicSerializer, ResourceSerializer, 
    QuizListSerializer, QuizDetailSerializer,
    QuizSubmissionSerializer, QuizResultSerializer
)

class TopicViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['specialization']


class ResourceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['specialization', 'type', 'topic']
    search_fields = ['title', 'description']


class QuizViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Quiz.objects.all().prefetch_related('questions')
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['specialization']
    search_fields = ['title', 'description']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return QuizDetailSerializer
        return QuizListSerializer
    
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        quiz = self.get_object()
        serializer = QuizSubmissionSerializer(data=request.data, context={'quiz': quiz})
        serializer.is_valid(raise_exception=True)
        
        answers = serializer.validated_data['answers']
        
        # حساب النتيجة
        questions = list(quiz.questions.all().prefetch_related('options'))
        correct_count = 0
        results = []
        
        for i, question in enumerate(questions):
            user_answer = answers[i]
            
            # الحصول على الإجابة الصحيحة
            options = list(question.options.all())
            correct_index = -1
            for j, option in enumerate(options):
                if option.is_correct:
                    correct_index = j
                    break
            
            # تحديد ما إذا كانت الإجابة صحيحة
            is_correct = (user_answer == correct_index)
            if is_correct:
                correct_count += 1
            
            # إضافة نتيجة السؤال
            results.append({
                'question_id': question.id,
                'user_answer': user_answer,
                'correct_answer': correct_index,
                'is_correct': is_correct,
                'question_text': question.text
            })
        
        # إعداد النتائج
        result_data = {
            'quiz': quiz,
            'score': correct_count,
            'correct_count': correct_count,
            'total_count': len(questions),
            'percentage': (correct_count / len(questions)) * 100 if questions else 0,
            'results': results
        }
        
        result_serializer = QuizResultSerializer(result_data)
        return Response(result_serializer.data)
 