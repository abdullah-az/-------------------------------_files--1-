import  axiosClient from './axiosClient';

interface UserData {
  name: string;
  email: string;
  role: 'admin' | 'student';
  university?: string;
  specialty?: string;
  status: 'active' | 'inactive';
}

const userService = {
  // الحصول على قائمة المستخدمين (للمشرفين فقط)
  getUsers: async (params = {}) => {
    try {
      const response = await axiosClient.get('users/', { params });
      return response.data;
    } catch (error) {
      console.error('خطأ في جلب قائمة المستخدمين:', error);
      throw error;
    }
  },

  // الحصول على تفاصيل مستخدم محدد (للمشرفين فقط)
  getUser: async (id: string) => {
    try {
      const response = await axiosClient.get(`users/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`خطأ في جلب المستخدم رقم ${id}:`, error);
      throw error;
    }
  },

  // إنشاء مستخدم جديد (للمشرفين فقط)
  createUser: async (userData: UserData) => {
    try {
      const response = await axiosClient.post('users/', userData);
      return response.data;
    } catch (error) {
      console.error('خطأ في إنشاء مستخدم جديد:', error);
      throw error;
    }
  },

  // تحديث بيانات مستخدم (للمشرفين فقط)
  updateUser: async (id: string, userData: Partial<UserData>) => {
    try {
      const response = await axiosClient.put(`users/${id}/`, userData);
      return response.data;
    } catch (error) {
      console.error(`خطأ في تحديث المستخدم رقم ${id}:`, error);
      throw error;
    }
  },

  // حذف مستخدم (للمشرفين فقط)
  deleteUser: async (id: string) => {
    try {
      const response = await axiosClient.delete(`users/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`خطأ في حذف المستخدم رقم ${id}:`, error);
      throw error;
    }
  },

  // تغيير كلمة المرور (للمستخدم الحالي)
  changePassword: async (oldPassword: string, newPassword: string) => {
    try {
      const response = await axiosClient.post('auth/change-password/', {
        old_password: oldPassword,
        new_password: newPassword
      });
      return response.data;
    } catch (error) {
      console.error('خطأ في تغيير كلمة المرور:', error);
      throw error;
    }
  },

  // تحديث الملف الشخصي (للمستخدم الحالي)
  updateProfile: async (profileData: Partial<UserData>) => {
    try {
      const response = await axiosClient.put('auth/user/', profileData);
      return response.data;
    } catch (error) {
      console.error('خطأ في تحديث الملف الشخصي:', error);
      throw error;
    }
  }
};

export default userService;
 