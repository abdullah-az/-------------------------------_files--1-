from  django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/questions/', include('questions.urls')),
    path('api/exams/', include('exams.urls')),
    path('api/resources/', include('resources.urls')),
    path('api/users/', include('users.admin_urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
 