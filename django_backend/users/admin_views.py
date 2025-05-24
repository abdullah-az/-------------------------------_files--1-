from  rest_framework import viewsets, permissions
from .models import User
from .serializers import AdminUserSerializer

class IsAdminUser(permissions.BasePermission):
    """
    التحقق من أن المستخدم هو مشرف في النظام.
    """
    def has_permission(self, request, view):
        return request.user and request.user.role == 'admin'


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    
    def perform_create(self, serializer):
        serializer.save()
    
    def perform_update(self, serializer):
        instance = serializer.instance
        status = self.request.data.get('status')
        
        # تحديث حالة المستخدم (نشط/غير نشط)
        if status is not None:
            instance.is_active = (status == 'active')
        
        serializer.save()
 