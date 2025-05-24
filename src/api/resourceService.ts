import  axiosClient from './axiosClient';

const resourceService = {
  // الحصول على المصادر التعليمية
  getResources: async (params = {}) => {
    try {
      const response = await axiosClient.get('resources/', { params });
      return response.data;
    } catch (error) {
      console.error('خطأ في جلب المصادر التعليمية:', error);
      throw error;
    }
  },

  // الحصول على تفاصيل مصدر محدد
  getResource: async (id: string) => {
    try {
      const response = await axiosClient.get(`resources/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`خطأ في جلب المصدر رقم ${id}:`, error);
      throw error;
    }
  },

  // الحصول على جميع الاختبارات القصيرة
  getQuizzes: async (params = {}) => {
    try {
      const response = await axiosClient.get('resources/quizzes/', { params });
      return response.data;
    } catch (error) {
      console.error('خطأ في جلب الاختبارات القصيرة:', error);
      throw error;
    }
  },

  // الحصول على تفاصيل اختبار قصير محدد
  getQuiz: async (id: string) => {
    try {
      const response = await axiosClient.get(`resources/quizzes/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`خطأ في جلب الاختبار القصير رقم ${id}:`, error);
      throw error;
    }
  },

  // إرسال إجابات اختبار قصير
  submitQuiz: async (quizId: string, answers: number[]) => {
    try {
      const response = await axiosClient.post(`resources/quizzes/${quizId}/submit/`, { answers });
      return response.data;
    } catch (error) {
      console.error(`خطأ في إرسال إجابات الاختبار القصير رقم ${quizId}:`, error);
      throw error;
    }
  }
};

export default resourceService;
 