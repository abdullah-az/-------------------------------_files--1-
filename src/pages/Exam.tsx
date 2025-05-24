import  { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Clock, AlertCircle, CheckCircle, X } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  attachment?: {
    type: 'image' | 'code' | 'text' | 'diagram';
    content: string;
  };
}

interface ExamConfig {
  examId: string;
  examTitle: string;
  questionCount: number;
  timeLimit: number; // in minutes
  startTime: string;
}

// Mock questions for different specializations
const mockQuestionsBank: Record<string, Question[]> = {
  'software': [
    {
      id: 1,
      text: 'أي من التالي ليس من هياكل البيانات الخطية؟',
      options: ['المصفوفة (Array)', 'القائمة المتصلة (Linked List)', 'الشجرة (Tree)', 'المكدس (Stack)'],
      correctAnswer: 2
    },
    {
      id: 2,
      text: 'ما هو تعقيد الوقت لعملية البحث في شجرة ثنائية متوازنة؟',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
      correctAnswer: 2
    },
    {
      id: 3,
      text: 'أي من أنماط التصميم التالية يستخدم للحد من عدد الكائنات المنشأة من صنف معين؟',
      options: ['Singleton', 'Factory', 'Observer', 'Decorator'],
      correctAnswer: 0,
      attachment: {
        type: 'code',
        content: `class Singleton {
  private static instance: Singleton;
  
  private constructor() {}
  
  public static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
}`
      }
    },
    {
      id: 4,
      text: 'ما هي الخاصية الأساسية لهيكل بيانات الكومة (Heap)؟',
      options: [
        'العناصر مرتبة تصاعدياً من الجذر إلى الأوراق',
        'كل عقدة أب أكبر من (أو تساوي) عقدتيها الابنتين',
        'لا يمكن أن يكون لديها عناصر مكررة',
        'جميع المستويات مكتملة باستثناء المستوى الأخير'
      ],
      correctAnswer: 1
    },
    {
      id: 5,
      text: 'ما هي المشكلة الرئيسية التي يحلها نمط التصميم MVC؟',
      options: [
        'يقلل من التكرار في الكود',
        'يفصل بين منطق العمل وواجهة المستخدم',
        'يحسن أداء التطبيق',
        'يقلل من استهلاك الذاكرة'
      ],
      correctAnswer: 1,
      attachment: {
        type: 'diagram',
        content: 'https://images.unsplash.com/photo-1501300140941-6c556d26c1b9?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwzfHxlZHVjYXRpb25hbCUyMHBsYXRmb3JtJTIwYXJhYmljJTIwdXNlciUyMGludGVyZmFjZSUyMGV4YW0lMjBkYXNoYm9hcmR8ZW58MHx8fHwxNzQ2NjE3MDk0fDA'
      }
    }
  ],
  'networks': [
    {
      id: 1,
      text: 'أي من البروتوكولات التالية يعمل في طبقة النقل من نموذج OSI؟',
      options: ['HTTP', 'IP', 'TCP', 'Ethernet'],
      correctAnswer: 2
    },
    {
      id: 2,
      text: 'ما هو البروتوكول المسؤول عن ترجمة أسماء النطاقات إلى عناوين IP؟',
      options: ['DHCP', 'DNS', 'FTP', 'SMTP'],
      correctAnswer: 1,
      attachment: {
        type: 'diagram',
        content: 'https://images.unsplash.com/photo-1517098343-2547f8016001?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw0fHxlZHVjYXRpb25hbCUyMHBsYXRmb3JtJTIwYXJhYmljJTIwdXNlciUyMGludGVyZmFjZSUyMGV4YW0lMjBkYXNoYm9hcmR8ZW58MHx8fHwxNzQ2NjE3MDk0fDA'
      }
    },
    {
      id: 3,
      text: 'ما هو مفهوم NAT (Network Address Translation)؟',
      options: [
        'بروتوكول للتحقق من هوية المستخدمين',
        'تقنية لترجمة عناوين IP الداخلية إلى عنوان IP خارجي واحد أو أكثر',
        'بروتوكول لتوجيه حزم البيانات عبر الشبكة',
        'تقنية للربط بين شبكتين محليتين مختلفتين'
      ],
      correctAnswer: 1
    }
  ],
  'ai': [
    {
      id: 1,
      text: 'ما هو الفرق الرئيسي بين التعلم الخاضع للإشراف والتعلم غير الخاضع للإشراف؟',
      options: [
        'التعلم الخاضع للإشراف يستخدم بيانات مصنفة، بينما التعلم غير الخاضع للإشراف يستخدم بيانات غير مصنفة',
        'التعلم الخاضع للإشراف يتطلب قوة حوسبة أكبر',
        'التعلم غير الخاضع للإشراف يكون دائماً أكثر دقة',
        'لا يوجد فرق بينهما، المصطلحان مترادفان'
      ],
      correctAnswer: 0
    },
    {
      id: 2,
      text: 'ما هي وحدات معالجة الرسومات (GPUs) وما علاقتها بالتعلم العميق؟',
      options: [
        'وحدات تستخدم فقط لعرض الرسومات ولا علاقة لها بالتعلم العميق',
        'وحدات متخصصة في العمليات المتسلسلة مما يجعلها غير مناسبة للتعلم العميق',
        'وحدات تتيح معالجة الكثير من العمليات بالتوازي مما يسرع تدريب نماذج التعلم العميق',
        'وحدات متخصصة في تخزين البيانات المؤقتة لنماذج التعلم العميق'
      ],
      correctAnswer: 2
    }
  ],
  'general': [
    {
      id: 1,
      text: 'ما هو مبدأ عمل خوارزمية البحث الثنائي (Binary Search)؟',
      options: [
        'البحث في نصف المصفوفة الأيمن ثم البحث في النصف الأيسر',
        'البحث في كامل المصفوفة بشكل خطي',
        'المقارنة مع العنصر الأوسط والبحث في النصف المناسب',
        'مقارنة العنصر المطلوب مع جميع عناصر المصفوفة في آن واحد'
      ],
      correctAnswer: 2
    },
    {
      id: 2,
      text: 'ما هو سبب استخدام الترميز (Encoding) في نقل البيانات عبر الشبكات؟',
      options: [
        'لزيادة حجم البيانات المنقولة',
        'لتقليل سرعة النقل',
        'لحماية البيانات من القراءة غير المصرح بها',
        'لضمان سلامة البيانات وتمثيلها بشكل صحيح'
      ],
      correctAnswer: 3
    }
  ]
};

const Exam = () => {
  const navigate = useNavigate();
  
  // حالة الامتحان
  const [examConfig, setExamConfig] = useState<ExamConfig | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examResult, setExamResult] = useState<any>(null);
  
  // استرجاع معرف الامتحان من العنوان
  const examId = window.location.pathname.split('/').pop() || '';
  
  // تهيئة الامتحان
  useEffect(() => {
    const loadExam = async () => {
      setIsLoading(true);
      
      // محاكاة استرجاع بيانات الامتحان من الخادم
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // اختيار التخصص بناءً على معرف الامتحان
      let specialization: string;
      if (examId.includes('software')) {
        specialization = 'software';
      } else if (examId.includes('networks')) {
        specialization = 'networks';
      } else if (examId.includes('ai')) {
        specialization = 'ai';
      } else {
        specialization = 'general';
      }
      
      // اختيار عدد الأسئلة
      const questionCount = 5;
      
      // إنشاء تكوين الامتحان
      const config: ExamConfig = {
        examId: examId,
        examTitle: `امتحان ${getSpecializationName(specialization)}`,
        questionCount: questionCount,
        timeLimit: questionCount * 2, // دقيقتان لكل سؤال
        startTime: new Date().toISOString()
      };
      
      // الحصول على الأسئلة من بنك الأسئلة
      const availableQuestions = mockQuestionsBank[specialization] || [];
      const selectedQuestions = availableQuestions.slice(0, questionCount);
      
      setExamConfig(config);
      setQuestions(selectedQuestions);
      setUserAnswers(new Array(selectedQuestions.length).fill(-1));
      setRemainingTime(config.timeLimit * 60); // تحويل الدقائق إلى ثوانٍ
      setIsLoading(false);
    };
    
    loadExam();
  }, [examId]);
  
  // إدارة مؤقت الامتحان
  useEffect(() => {
    if (isLoading || examResult || remainingTime <= 0) return;
    
    const timer = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // تقديم الامتحان تلقائياً عند انتهاء الوقت
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isLoading, examResult, remainingTime]);
  
  // تنسيق الوقت المتبقي
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // الحصول على اسم التخصص
  const getSpecializationName = (code: string) => {
    switch (code) {
      case 'software':
        return 'هندسة البرمجيات';
      case 'networks':
        return 'هندسة الشبكات';
      case 'ai':
        return 'الذكاء الاصطناعي';
      case 'general':
        return 'التخصص العام';
      default:
        return code;
    }
  };
  
  // التعامل مع اختيار إجابة
  const handleAnswerSelect = (answerIndex: number) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newUserAnswers);
  };
  
  // الانتقال إلى السؤال التالي
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  // الانتقال إلى السؤال السابق
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  // تقديم الامتحان
  const handleSubmitExam = useCallback(async () => {
    if (!examConfig || isSubmitting) return;
    
    setIsSubmitting(true);
    
    // محاكاة إرسال الإجابات إلى الخادم
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // حساب النتيجة
    let correctCount = 0;
    const questionResults = [];
    
    for (let i = 0; i < questions.length; i++) {
      const isCorrect = userAnswers[i] === questions[i].correctAnswer;
      if (isCorrect) correctCount++;
      
      questionResults.push({
        questionText: questions[i].text,
        userAnswer: userAnswers[i] !== -1 ? questions[i].options[userAnswers[i]] : 'لم تتم الإجابة',
        correctAnswer: questions[i].options[questions[i].correctAnswer],
        isCorrect
      });
    }
    
    // إنشاء نتيجة الامتحان
    const result = {
      examId: examConfig.examId,
      examTitle: examConfig.examTitle,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      percentage: Math.round((correctCount / questions.length) * 100),
      timeTaken: examConfig.timeLimit * 60 - remainingTime,
      questions: questionResults
    };
    
    setExamResult(result);
    setIsSubmitting(false);
  }, [examConfig, isSubmitting, questions, userAnswers, remainingTime]);
  
  // التحقق من اكتمال الإجابات
  const isCompleted = userAnswers.every(answer => answer !== -1);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loader" />
      </div>
    );
  }
  
  // عرض نتيجة الامتحان بعد التقديم
  if (examResult) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6">
            <h1 className="text-2xl font-bold text-white">نتيجة الامتحان</h1>
            <p className="mt-2 text-primary-100">
              {examResult.examTitle}
            </p>
          </div>
          
          <div className="p-6">
            <div className="mb-8">
              <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-6">
                <div className="w-full md:w-1/3 bg-green-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{examResult.correctAnswers}</div>
                  <div className="text-sm text-gray-600">إجابات صحيحة</div>
                </div>
                
                <div className="w-full md:w-1/3 bg-red-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">{examResult.totalQuestions - examResult.correctAnswers}</div>
                  <div className="text-sm text-gray-600">إجابات خاطئة</div>
                </div>
                
                <div className="w-full md:w-1/3 bg-primary-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">{examResult.percentage}%</div>
                  <div className="text-sm text-gray-600">النسبة المئوية</div>
                </div>
              </div>
              
              <div className="text-center mb-6">
                <div className={`text-xl font-bold ${
                  examResult.percentage >= 80 ? 'text-green-600' :
                  examResult.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                } mb-1`}>
                  {examResult.percentage >= 80 ? 'ممتاز!' :
                   examResult.percentage >= 60 ? 'جيد' : 'تحتاج إلى مزيد من الدراسة'}
                </div>
                <p className="text-gray-600">
                  لقد أجبت على {examResult.correctAnswers} من أصل {examResult.totalQuestions} أسئلة بشكل صحيح.
                </p>
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-4">مراجعة الإجابات</h2>
            
            <div className="space-y-6">
              {examResult.questions.map((item: any, index: number) => (
                <div key={index} className={`border ${
                  item.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                } rounded-lg p-4`}>
                  <div className="flex items-start">
                    <div className="mt-1">
                      {item.isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <X className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="mr-3 flex-grow">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-medium text-gray-900">السؤال {index + 1}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.isCorrect ? 'إجابة صحيحة' : 'إجابة خاطئة'}
                        </span>
                      </div>
                      <p className="text-gray-800 mb-3">{item.questionText}</p>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <span className="text-sm font-medium text-gray-700">إجابتك:</span>
                          <span className={`mr-2 text-sm ${
                            item.isCorrect ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {item.userAnswer}
                          </span>
                        </div>
                        {!item.isCorrect && (
                          <div className="flex items-start">
                            <span className="text-sm font-medium text-gray-700">الإجابة الصحيحة:</span>
                            <span className="mr-2 text-sm text-green-600">{item.correctAnswer}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => navigate('/')}
                className="btn btn-primary"
              >
                العودة إلى الصفحة الرئيسية
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // صفحة الامتحان
  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              {examConfig && (
                <h1 className="text-xl sm:text-2xl font-bold text-white">{examConfig.examTitle}</h1>
              )}
              <p className="mt-1 text-sm text-primary-100">
                السؤال {currentQuestionIndex + 1} من {questions.length}
              </p>
            </div>
            <div className="mt-2 sm:mt-0 flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full">
              <Clock className="h-5 w-5 text-white ml-1" />
              <span className="text-white font-mono">{formatTime(remainingTime)}</span>
            </div>
          </div>
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="mb-4">
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              {currentQuestionIndex + 1}. {currentQuestion.text}
            </h2>
            
            {currentQuestion.attachment && (
              <div className="mt-3 mb-4">
                {currentQuestion.attachment.type === 'image' && (
                  <img 
                    src={currentQuestion.attachment.content} 
                    alt="مرفق السؤال" 
                    className="max-w-full h-auto rounded-md border border-gray-200 mb-4"
                  />
                )}
                
                {currentQuestion.attachment.type === 'code' && (
                  <div className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto mb-4">
                    <pre className="text-sm whitespace-pre-wrap break-all">
                      {currentQuestion.attachment.content}
                    </pre>
                  </div>
                )}
                
                {currentQuestion.attachment.type === 'text' && (
                  <div className="bg-gray-100 p-4 rounded-md mb-4">
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {currentQuestion.attachment.content}
                    </p>
                  </div>
                )}
                
                {currentQuestion.attachment.type === 'diagram' && (
                  <img 
                    src={currentQuestion.attachment.content} 
                    alt="رسم تخطيطي للسؤال" 
                    className="max-w-full h-auto rounded-md border border-gray-200 mb-4"
                  />
                )}
              </div>
            )}
          </div>
          
          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, index) => (
              <div 
                key={index}
                className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                  userAnswers[currentQuestionIndex] === index
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => handleAnswerSelect(index)}
              >
                <div className="flex items-center">
                  <div className={`flex-shrink-0 h-5 w-5 rounded-full border ${
                    userAnswers[currentQuestionIndex] === index
                      ? 'bg-primary-500 border-primary-500'
                      : 'border-gray-400'
                  } flex items-center justify-center mr-3`}>
                    {userAnswers[currentQuestionIndex] === index && (
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className={`text-sm ${
                    userAnswers[currentQuestionIndex] === index
                      ? 'text-primary-700 font-medium'
                      : 'text-gray-700'
                  }`}>
                    {option}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className={`btn btn-outline flex items-center ${
                currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ChevronRight className="h-5 w-5 ml-1" />
              السؤال السابق
            </button>
            
            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmitExam}
                disabled={isSubmitting}
                className="btn btn-primary flex items-center"
              >
                {isSubmitting ? 'جارِ التقديم...' : 'إنهاء الامتحان'}
                {!isSubmitting && <CheckCircle className="h-5 w-5 mr-1" />}
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="btn btn-primary flex items-center"
              >
                السؤال التالي
                <ChevronLeft className="h-5 w-5 mr-1" />
              </button>
            )}
          </div>
        </div>
        
        {/* شريط التقدم */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-wrap gap-2 justify-center">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`h-8 w-8 rounded-full flex items-center justify-center text-sm ${
                  index === currentQuestionIndex
                    ? 'bg-primary-600 text-white'
                    : userAnswers[index] !== -1
                    ? 'bg-primary-100 text-primary-700 border border-primary-300'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          
          {!isCompleted && (
            <div className="mt-4 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-yellow-500 ml-1" />
              <span className="text-sm text-gray-600">لم تتم الإجابة على جميع الأسئلة بعد.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Exam;
 