import  { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'student';
}

const PrivateRoute = ({ children, requiredRole }: PrivateRouteProps) => {
  const { isAuthenticated, userRole, loading } = useAuth();
  
  // أثناء التحميل، عرض شاشة التحميل
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loader" />
      </div>
    );
  }
  
  // إذا لم يكن المستخدم مسجل دخوله، إعادة توجيهه إلى صفحة تسجيل الدخول
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // إذا كان هناك دور مطلوب والمستخدم ليس لديه هذا الدور، إعادة توجيهه إلى الصفحة الرئيسية
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  // إذا كان المستخدم مسجل دخوله ولديه الدور المطلوب، عرض المحتوى
  return <>{children}</>;
};

export default PrivateRoute;
 