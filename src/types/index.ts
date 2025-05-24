//  تعريفات الأنواع المستخدمة في التطبيق

// المستخدم
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
  university?: string;
  specialty?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

// السؤال
export interface Question {
  id: string;
  text: string;
  options: { id: number; text: string }[];
  correctAnswer: number;
  specialization: 'software' | 'networks' | 'ai' | 'general';
  year: string;
  marks: number;
  attachment?: {
    type: 'image' | 'code' | 'text' | 'diagram';
    content: string;
  };
}

// الامتحان
export interface Exam {
  id: string;
  title: string;
  specialization: 'software' | 'networks' | 'ai' | 'general';
  questionCount: number;
  timeLimit: number; // بالدقائق
  questions: Question[];
  status: 'in_progress' | 'completed';
  startTime: string;
  endTime?: string;
  score?: number;
  percentage?: number;
}

// الاختبار القصير
export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  specialization: 'software' | 'networks' | 'ai' | 'general';
  timeLimit: number; // بالدقائق
}

// نتيجة الاختبار القصير
export interface QuizResult {
  correct: number;
  incorrect: number;
  total: number;
  percentage: number;
  questions: {
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[];
}

// المصدر التعليمي
export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'file' | 'link' | 'video';
  specialization: 'software' | 'networks' | 'ai' | 'general' | 'all';
  url: string;
  createdAt: string;
}

// نشاط المستخدم
export interface UserActivity {
  id: string;
  type: 'exam' | 'quiz' | 'resource';
  title: string;
  specialization: 'software' | 'networks' | 'ai' | 'general';
  timestamp: string;
  score?: number;
  percentage?: number;
}

// إحصائيات المستخدم
export interface UserStats {
  examsCompleted: number;
  quizzesCompleted: number;
  avgScore: number;
  specializationProgress: {
    software: number;
    networks: number;
    ai: number;
    general: number;
  };
}
 