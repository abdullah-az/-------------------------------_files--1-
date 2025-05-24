import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import examService from '../api/examService';
import { Book, CheckCircle, Clock, AlertCircle, HelpCircle, Play, Brain, Sparkles } from 'lucide-react';

interface Exam {
  id: string;
  title: string;
  description: string;
  specialization: 'software' | 'networks' | 'ai' | 'general';
  questionCount: number;
  timeLimit: number; // بالدقائق
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const ExamStart = () => {
  const navigate = useNavigate();
  const [examOptions, setExamOptions] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [questionCount, setQuestionCount] = useState(20);
  const [examMode, setExamMode] = useState<'random' | 'fixed' | 'ai'>('random');
  const [error, setError] = useState('');
  const [isStartingExam, setIsStartingExam] = useState(false);
  
  useEffect(() => {
    // في بيئة حقيقية، هنا سيتم استدعاء API للحصول على قائمة الامتحانات المتاحة
    const fetchExamOptions = async () => {
      setIsLoading(true);
      
      // محاكاة تأخير الشبكة
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // بيانات تجريبية للامتحانات المتاحة
      const mockExamOptions: Exam[] = [
        {
          id: 'exam1',
          title: 'امتحان هندسة البرمجيات الشامل',
          description: 'امتحان شامل يغطي كافة موضوعات هندسة البرمجيات.',
          specialization: 'software',
          questionCount: 30,
          timeLimit: 45,
          difficulty: 'intermediate'
        },
        {
          id: 'exam2',
          title: 'امتحان هندسة الشبكات الأساسي',
          description: 'امتحان يغطي المفاهيم الأساسية في هندسة الشبكات.',
          specialization: 'networks',
          questionCount: 25,
          timeLimit: 40,
          difficulty: 'beginner'
        },
        {
          id: 'exam3',
          title: 'امتحان الذكاء الاصطناعي المتقدم',
          description: 'امتحان متقدم في مفاهيم وتقنيات الذكاء الاصطناعي.',
          specialization: 'ai',
          questionCount: 35,
          timeLimit: 50,
          difficulty: 'advanced'
        },
        {
          id: 'exam4',
          title: 'امتحان التخصص العام',
          description: 'امتحان يغطي المفاهيم الأساسية في الهندسة المعلوماتية.',
          specialization: 'general',
          questionCount: 40,
          timeLimit: 60,
          difficulty: 'intermediate'
        }
      ];
      
      setExamOptions(mockExamOptions);
      setIsLoading(false);
    };
    
    fetchExamOptions();
  }, []);
  
  const handleExamSelect = (examId: string) => {
    setSelectedExamId(examId);
    setExamMode('fixed');
    
    // تحديث التخصص وعدد الأسئلة بناءً على الامتحان المحدد
    const selectedExam = examOptions.find(exam => exam.id === examId);
    if (selectedExam) {
      setSelectedSpecialization(selectedExam.specialization);
      setQuestionCount(selectedExam.questionCount);
    }
  };
  
  const handleStartRandomExam = async () => {
    try {
      // استدعاء API لبدء امتحان عشوائي جديد
      const response = await examService.startExam({
        specialization: selectedSpecialization,
        question_count: questionCount,
        exam_type: 'random'
      });
      
      // توجيه المستخدم إلى صفحة الامتحان
      navigate(`/exams/${response.exam_id}`);
    } catch (error) {
      console.error('خطأ في بدء الامتحان العشوائي:', error);
      // يمكن إضافة معالجة الخطأ هنا (مثل عرض رسالة خطأ للمستخدم)
    }
  };
  
  const handleStartFixedExam = async () => {
    // في بيئة حقيقية، هنا سيتم استدعاء API للحصول على الامتحان المحدد
    // وتوجيه المستخدم إلى صفحة الامتحان
    
    if (selectedExamId) {
      try {
        // يمكن استدعاء API هنا إذا كان هناك حاجة لمعالجة خاصة للامتحان المحدد
        // أو يمكن استخدام الامتحان المحدد مباشرة
        navigate(`/exams/${selectedExamId}`);
      } catch (error) {
        console.error('خطأ في بدء الامتحان المحدد:', error);
        // يمكن إضافة معالجة الخطأ هنا
      }
    }
  };
  
  // دالة لبدء امتحان ذكي باستخدام الذكاء الاصطناعي
  const handleStartAIExam = async () => {
    // التحقق من صحة البيانات المدخلة
    if (!selectedSpecialization) {
      setError('يرجى اختيار التخصص أولاً');
      return;
    }
    
    if (questionCount < 5 || questionCount > 50) {
      setError('عدد الأسئلة يجب أن يكون بين 5 و 50');
      return;
    }
    
    setError('');
    setIsStartingExam(true);
    
    try {
      console.log('بدء الامتحان الذكي مع البيانات:', {
        specialization: selectedSpecialization,
        question_count: questionCount
      });
      
      // استدعاء API لبدء امتحان ذكي جديد
      const response = await examService.startAIExam({
        specialization: selectedSpecialization,
        question_count: questionCount
      });
      
      console.log('استجابة الخادم:', response);
      
      // التحقق من وجود exam_id في الاستجابة
      if (response && response.exam_id) {
        // توجيه المستخدم إلى صفحة الامتحان
        navigate(`/exams/${response.exam_id}`);
      } else {
        throw new Error('لم يتم الحصول على معرف الامتحان من الخادم');
      }
    } catch (error: any) {
      console.error('خطأ في بدء الامتحان الذكي:', error);
      
      // معالجة أنواع مختلفة من الأخطاء
      if (error.response) {
        // خطأ من الخادم
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error;
        
        if (status === 404) {
          setError('خدمة الامتحان الذكي غير متوفرة حالياً');
        } else if (status === 401) {
          setError('يجب تسجيل الدخول أولاً');
        } else if (status === 400) {
          setError(message || 'بيانات غير صحيحة');
        } else {
          setError(`خطأ في الخادم: ${message || 'خطأ غير معروف'}`);
        }
      } else if (error.request) {
        // خطأ في الشبكة
        setError('خطأ في الاتصال بالخادم. تأكد من اتصالك بالإنترنت.');
      } else {
        // خطأ آخر
        setError(error.message || 'حدث خطأ غير متوقع');
      }
    } finally {
      setIsStartingExam(false);
    }
  };
  
  // الحصول على اسم التخصص
  const getSpecializationName = (specialization: string) => {
    switch (specialization) {
      case 'software':
        return 'هندسة البرمجيات';
      case 'networks':
        return 'هندسة الشبكات';
      case 'ai':
        return 'الذكاء الاصطناعي';
      case 'general':
        return 'التخصص العام';
      default:
        return specialization;
    }
  };
  
  // الحصول على اسم مستوى الصعوبة
  const getDifficultyName = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'مبتدئ';
      case 'intermediate':
        return 'متوسط';
      case 'advanced':
        return 'متقدم';
      default:
        return difficulty;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <span className="loader" />
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6">
          <h1 className="text-2xl font-bold text-white">بدء امتحان جديد</h1>
          <p className="mt-2 text-primary-100">
            اختر تخصصًا وعدد الأسئلة لبدء امتحان عشوائي، أو اختر أحد الامتحانات المحددة مسبقًا.
          </p>
        </div>
        
        <div className="p-6">
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setExamMode('random')}
              className={`flex-1 py-3 rounded-lg border-2 flex items-center justify-center ${
                examMode === 'random'
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <AlertCircle className={`h-5 w-5 ml-2 ${examMode === 'random' ? 'text-primary-600' : 'text-gray-500'}`} />
              <span>امتحان عشوائي</span>
            </button>
            <button
              onClick={() => setExamMode('fixed')}
              className={`flex-1 py-3 rounded-lg border-2 flex items-center justify-center ${
                examMode === 'fixed'
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Book className={`h-5 w-5 ml-2 ${examMode === 'fixed' ? 'text-primary-600' : 'text-gray-500'}`} />
              <span>امتحان اعتيادي</span>
            </button>
            <button
              onClick={() => setExamMode('ai')}
              className={`flex-1 py-3 rounded-lg border-2 flex items-center justify-center ${
                examMode === 'ai'
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Brain className={`h-5 w-5 ml-2 ${examMode === 'ai' ? 'text-primary-600' : 'text-gray-500'}`} />
              <span>امتحان ذكي</span>
            </button>
          </div>
          
          {/* امتحان عشوائي */}
          {examMode === 'random' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                  التخصص
                </label>
                <select
                  id="specialization"
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">اختر التخصص</option>
                  <option value="software">هندسة البرمجيات</option>
                  <option value="networks">هندسة الشبكات</option>
                  <option value="ai">الذكاء الاصطناعي</option>
                  <option value="general">التخصص العام</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="questionCount" className="block text-sm font-medium text-gray-700 mb-1">
                  عدد الأسئلة
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    id="questionCount"
                    min={5}
                    max={50}
                    step={5}
                    value={questionCount}
                    onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                  <span className="w-12 text-center text-gray-700 font-medium">{questionCount}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5</span>
                  <span>50</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <HelpCircle className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="mr-3">
                    <h3 className="text-sm font-medium text-gray-900">معلومات الامتحان</h3>
                    <p className="text-sm text-gray-500">
                      سيتم اختيار {questionCount} سؤال بشكل عشوائي من تخصص {selectedSpecialization ? getSpecializationName(selectedSpecialization) : "محدد"}. مدة الامتحان ستكون {Math.ceil(questionCount * 1.5)} دقيقة.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleStartRandomExam}
                  disabled={!selectedSpecialization}
                  className={`btn btn-primary flex items-center ${!selectedSpecialization ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Play className="h-5 w-5 ml-1" />
                  بدء الامتحان
                </button>
              </div>
            </div>
          )}
          
          {/* امتحان ذكي */}
          {examMode === 'ai' && (
            <div className="space-y-6">
              <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
                <div className="flex items-center mb-3">
                  <Sparkles className="h-5 w-5 text-primary-600 ml-2" />
                  <h3 className="text-primary-800 font-medium">امتحان ذكي باستخدام الذكاء الاصطناعي</h3>
                </div>
                <p className="text-sm text-gray-600">
                  سيقوم النظام بتوليد أسئلة جديدة باستخدام الذكاء الاصطناعي بناءً على نمط الأسئلة الموجودة في التخصص المحدد.
                </p>
              </div>
              
              {/* عرض رسائل الخطأ */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 ml-2" />
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                </div>
              )}
              
              <div>
                <label htmlFor="ai-specialization" className="block text-sm font-medium text-gray-700 mb-1">
                  التخصص
                </label>
                <select
                  id="ai-specialization"
                  value={selectedSpecialization}
                  onChange={(e) => {
                    setSelectedSpecialization(e.target.value);
                    setError(''); // مسح رسالة الخطأ عند تغيير التخصص
                  }}
                  className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  disabled={isStartingExam}
                >
                  <option value="">اختر التخصص</option>
                  <option value="software">هندسة البرمجيات</option>
                  <option value="networks">هندسة الشبكات</option>
                  <option value="ai">الذكاء الاصطناعي</option>
                  <option value="general">التخصص العام</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="ai-question-count" className="block text-sm font-medium text-gray-700 mb-1">
                  عدد الأسئلة (5-50)
                </label>
                <input
                  type="number"
                  id="ai-question-count"
                  min="5"
                  max="50"
                  value={questionCount}
                  onChange={(e) => {
                    setQuestionCount(parseInt(e.target.value) || 5);
                    setError(''); // مسح رسالة الخطأ عند تغيير عدد الأسئلة
                  }}
                  className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  disabled={isStartingExam}
                />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <HelpCircle className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="mr-3">
                    <h3 className="text-sm font-medium text-gray-900">معلومات الامتحان الذكي</h3>
                    <p className="text-sm text-gray-500">
                      سيتم توليد {questionCount} سؤال جديد باستخدام الذكاء الاصطناعي من تخصص {selectedSpecialization ? getSpecializationName(selectedSpecialization) : "محدد"}. قد يستغرق التوليد بضع ثوانٍ.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleStartAIExam}
                  disabled={!selectedSpecialization || isStartingExam}
                  className={`btn btn-primary flex items-center ${
                    !selectedSpecialization || isStartingExam ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isStartingExam ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-1"></div>
                      جاري التوليد...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 ml-1" />
                      بدء الامتحان الذكي
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
          
          {/* امتحان اعتيادي */}
          {examMode === 'fixed' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">الامتحانات المتاحة</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {examOptions.map((exam) => (
                    <div 
                      key={exam.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedExamId === exam.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => handleExamSelect(exam.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-base font-medium text-gray-900">{exam.title}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          exam.specialization === 'software' ? 'bg-blue-100 text-blue-800' :
                          exam.specialization === 'networks' ? 'bg-green-100 text-green-800' :
                          exam.specialization === 'ai' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {getSpecializationName(exam.specialization)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{exam.description}</p>
                      <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          <CheckCircle className="h-4 w-4 ml-1" />
                          {exam.questionCount} سؤال
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 ml-1" />
                          {exam.timeLimit} دقيقة
                        </span>
                        <span className="flex items-center">
                          <HelpCircle className="h-4 w-4 ml-1" />
                          المستوى: {getDifficultyName(exam.difficulty)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleStartFixedExam}
                  disabled={!selectedExamId}
                  className={`btn btn-primary flex items-center ${!selectedExamId ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Play className="h-5 w-5 ml-1" />
                  بدء الامتحان
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamStart;
 