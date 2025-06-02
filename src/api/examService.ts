import  axiosClient from './axiosClient';

interface ExamSubmission {
  exam_id: string;
  answers: number[];
}

interface StartExamData {
  specialization: string;
  question_count: number;
  exam_type: 'normal' | 'ai'; // Changed to be non-optional and align with backend
  ai_model_id?: number;       // Optional, only for 'ai' type
}

const examService = {
  // بدء امتحان جديد (قياسي أو ذكي)
  startExam: async (data: StartExamData) => {
    try {
      let endpoint = 'exams/start/';
      let payload: any = {
        specialization: data.specialization,
        question_count: data.question_count,
      };

      if (data.exam_type === 'ai') {
        endpoint = 'exams/start-ai/'; // Ensure this matches backend URL for AI exams
        if (!data.ai_model_id) {
          throw new Error("AI Model ID is required for AI exams.");
        }
        payload.ai_model_id = data.ai_model_id;
      }
      // The backend expects 'exam_type' in the payload for start-ai, but not for start
      // However, the existing backend logic for /start-ai/ might implicitly set exam_type='ai'
      // For /start/ it's implicitly 'normal'.
      // For simplicity and if the backend handles it, we might not need to send exam_type in payload.
      // If backend /start-ai/ requires exam_type in payload, add: payload.exam_type = data.exam_type;

      const response = await axiosClient.post(endpoint, payload);
      return response.data;
    } catch (error) {
      console.error(`خطأ في بدء الامتحان (type: ${data.exam_type}):`, error);
      throw error;
    }
  },

  // الحصول على تفاصيل امتحان محدد
  getExam: async (examId: string) => {
    try {
      const response = await axiosClient.get(`exams/${examId}/`);
      return response.data;
    } catch (error) {
      console.error(`خطأ في جلب الامتحان رقم ${examId}:`, error);
      throw error;
    }
  },

  // إرسال إجابات الامتحان
  submitExam: async (submission: ExamSubmission) => {
    try {
      const response = await axiosClient.post('exams/submit/', submission);
      return response.data;
    } catch (error) {
      console.error('خطأ في إرسال إجابات الامتحان:', error);
      throw error;
    }
  },

  // الحصول على نتيجة امتحان محدد
  getExamResult: async (examId: string) => {
    try {
      const response = await axiosClient.get(`exams/${examId}/result/`);
      return response.data;
    } catch (error) {
      console.error(`خطأ في جلب نتيجة الامتحان رقم ${examId}:`, error);
      throw error;
    }
  },

  // الحصول على سجل الامتحانات للمستخدم الحالي
  getExamHistory: async () => {
    try {
      const response = await axiosClient.get('exams/history/');
      return response.data;
    } catch (error) {
      console.error('خطأ في جلب سجل الامتحانات:', error);
      throw error;
    }
  }
};

export default examService;
 