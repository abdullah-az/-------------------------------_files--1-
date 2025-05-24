from  django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'topics', views.TopicViewSet)
router.register(r'resources', views.ResourceViewSet)
router.register(r'quizzes', views.QuizViewSet)

urlpatterns = router.urls
 