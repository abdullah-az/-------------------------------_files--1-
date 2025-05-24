import  axiosClient from './axiosClient';

interface ExamSubmission {
  exam_id: string;
  answers: number[];
}

interface StartExamData {
  specialization: string;
  question_count: number;
  exam_type?: 'random' | 'fixed' | 'ai';
}

const examService = {
  // بدء امتحان جديد
  startExam: async (data: StartExamData) => {
    try {
      const response = await axiosClient.post('exams/start/', data);
      return response.data;
    } catch (error) {
      console.error('خطأ في بدء الامتحان:', error);
      throw error;
    }
  },
  
  // بدء امتحان ذكي باستخدام الذكاء الاصطناعي
  startAIExam: async (data: StartExamData) => {
    try {
      // إضافة نوع الامتحان كـ 'ai'
      const aiExamData = { ...data, exam_type: 'ai' };
      const response = await axiosClient.post('exams/start-ai/', aiExamData);
      return response.data;
    } catch (error) {
      console.error('خطأ في بدء الامتحان الذكي:', error);
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
 