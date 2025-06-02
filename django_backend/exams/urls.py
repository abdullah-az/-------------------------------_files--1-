from  django.urls import path
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'exams', views.ExamViewSet, basename='exam') # Changed path from '' to 'exams'
router.register(r'ai-models', views.AIModelViewSet, basename='aimodel')

urlpatterns = router.urls
 