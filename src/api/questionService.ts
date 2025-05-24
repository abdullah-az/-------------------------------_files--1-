import  axiosClient from './axiosClient';

interface QuestionData {
  text: string;
  options: string[];
  correct_answer: number;
  specialization: string;
  year: string;
  marks: number;
  attachment?: {
    type: 'image' | 'code' | 'text' | 'diagram';
    content: string;
  };
}

const questionService = {
  // الحصول على جميع الأسئلة
  getQuestions: async (params = {}) => {
    try {
      const response = await axiosClient.get('questions/', { params });
      return response.data;
    } catch (error) {
      console.error('خطأ في جلب الأسئلة:', error);
      throw error;
    }
  },

  // الحصول على سؤال محدد
  getQuestion: async (id: string) => {
    try {
      const response = await axiosClient.get(`questions/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`خطأ في جلب السؤال رقم ${id}:`, error);
      throw error;
    }
  },

  // إضافة سؤال جديد
  createQuestion: async (questionData: QuestionData) => {
    try {
      const response = await axiosClient.post('questions/', questionData);
      return response.data;
    } catch (error) {
      console.error('خطأ في إنشاء سؤال جديد:', error);
      throw error;
    }
  },

  // تحديث سؤال
  updateQuestion: async (id: string, questionData: Partial<QuestionData>) => {
    try {
      const response = await axiosClient.put(`questions/${id}/`, questionData);
      return response.data;
    } catch (error) {
      console.error(`خطأ في تحديث السؤال رقم ${id}:`, error);
      throw error;
    }
  },

  // حذف سؤال
  deleteQuestion: async (id: string) => {
    try {
      const response = await axiosClient.delete(`questions/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`خطأ في حذف السؤال رقم ${id}:`, error);
      throw error;
    }
  }
};

export default questionService;
 