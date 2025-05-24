import  { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

type UserRole = 'admin' | 'student' | null;

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  userData: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // التحقق من حالة المصادقة عند تحميل التطبيق
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUserData = localStorage.getItem('userData');
        
        if (token && storedUserData) {
          const user = JSON.parse(storedUserData);
          setIsAuthenticated(true);
          setUserRole(user.role);
          setUserData(user);
        }
      } catch (error) {
        console.error("فشل في تحميل بيانات المستخدم:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        setIsAuthenticated(false);
        setUserRole(null);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // استخدام معلومات تجريبية مباشرة للتجاوز مؤقتًا
      let userData: any;
      
      if (email === 'admin@example.com' && password === 'admin123') {
        userData = {
          id: 'admin1',
          name: 'مشرف النظام',
          email: 'admin@example.com',
          role: 'admin'
        };
      } else if (email === 'student@example.com' && password === 'student123') {
        userData = {
          id: 'student1',
          name: 'طالب تجريبي',
          email: 'student@example.com',
          role: 'student',
          university: 'جامعة دمشق',
          specialty: 'هندسة معلوماتية'
        };
      } else {
        throw new Error('بيانات الدخول غير صحيحة');
      }
      
      // تخزين بيانات المستخدم - مهم: لا تقم بتخزين كائنات معقدة تحتوي على دوال
      const mockToken = `mock-token-${Date.now()}`;
      localStorage.setItem('token', mockToken);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      setIsAuthenticated(true);
      setUserRole(userData.role);
      setUserData(userData);
      
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } catch (error: any) {
      setError(error.message || 'فشل تسجيل الدخول');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    setError(null);
    try {
      // محاكاة تسجيل مستخدم جديد
      const mockResponse = {
        token: `mock-token-${Date.now()}`,
        user: {
          id: `user-${Date.now()}`,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          university: userData.university || '',
          specialty: userData.specialty || ''
        }
      };
      
      // تخزين البيانات بشكل آمن
      localStorage.setItem('token', mockResponse.token);
      localStorage.setItem('userData', JSON.stringify(mockResponse.user));
      
      setIsAuthenticated(true);
      setUserRole(mockResponse.user.role);
      setUserData(mockResponse.user);
      
      if (mockResponse.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } catch (error: any) {
      setError(error.message || 'فشل التسجيل');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setLoading(true);
    try {
      // تسجيل الخروج بنجاح
      console.log("تم تسجيل الخروج بنجاح");
    } catch (error) {
      console.error("خطأ أثناء تسجيل الخروج:", error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      setIsAuthenticated(false);
      setUserRole(null);
      setUserData(null);
      setLoading(false);
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        userRole, 
        userData, 
        login, 
        logout, 
        register,
        loading,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
 