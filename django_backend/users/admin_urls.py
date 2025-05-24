from  django.urls import path
from rest_framework.routers import DefaultRouter
from . import admin_views

router = DefaultRouter()
router.register(r'', admin_views.UserViewSet)

urlpatterns = router.urls
 