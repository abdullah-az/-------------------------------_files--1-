import  axiosClient from './axiosClient';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'admin';
  university?: string;
  specialty?: string;
}

interface LoginData {
  email: string;
  password: string;
}

const authService = {
  // تسجيل مستخدم جديد
  register: async (userData: RegisterData) => {
    try {
      const response = await axiosClient.post('auth/register/', userData);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      console.error('خطأ في تسجيل المستخدم:', error);
      throw error;
    }
  },

  // تسجيل الدخول
  login: async (credentials: LoginData) => {
    try {
      const response = await axiosClient.post('auth/login/', credentials);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      console.error('خطأ في تسجيل الدخول:', error);
      throw error;
    }
  },

  // تسجيل الخروج
  logout: async () => {
    try {
      await axiosClient.post('auth/logout/');
      localStorage.removeItem('token');
    } catch (error) {
      console.error('خطأ في تسجيل الخروج:', error);
      throw error;
    }
  },

  // الحصول على بيانات المستخدم الحالي
  getUser: async () => {
    try {
      const response = await axiosClient.get('auth/user/');
      return response.data;
    } catch (error) {
      console.error('خطأ في جلب بيانات المستخدم:', error);
      throw error;
    }
  },

  // التحقق مما إذا كان المستخدم مسجل الدخول
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService;
 