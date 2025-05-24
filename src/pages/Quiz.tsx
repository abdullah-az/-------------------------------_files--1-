import  { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, ArrowRight, Home } from 'lucide-react';

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

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

interface QuizResult {
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

const Quiz = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  
  // جلب بيانات الاختبار القصير
  useEffect(() => {
    const fetchQuiz = async () => {
      setIsLoading(true);
      
      // محاكاة تأخير الشبكة
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // بيانات تجريبية للاختبار
      const mockQuiz: Quiz = {
        id: id || '',
        title: 'اختبار أساسيات هندسة البرمجيات',
        description: 'اختبار قصير يغطي المفاهيم الأساسية في هندسة البرمجيات.',
        questions: [
          {
            id: 1,
            text: 'ما هو النموذج الأكثر شيوعًا في دورة حياة تطوير البرمجيات؟',
            options: [
              'النموذج التسلسلي (Waterfall)',
              'النموذج المتكرر (Iterative)',
              'النموذج الحلزوني (Spiral)',
              'النموذج التدريجي (Incremental)'
            ],
            correctAnswer: 0
          },
          {
            id: 2,
            text: 'أي من المصطلحات التالية يشير إلى مجموعة من الكائنات ذات الصفات والسلوكيات المشتركة؟',
            options: [
              'الكائن (Object)',
              'الصنف (Class)',
              'الوراثة (Inheritance)',
              'التغليف (Encapsulation)'
            ],
            correctAnswer: 1
          },
          {
            id: 3,
            text: 'ما هو نمط التصميم الذي يسمح بإنشاء كائن واحد فقط من صنف معين؟',
            options: [
              'نمط الاستراتيجية (Strategy)',
              'نمط المراقب (Observer)',
              'نمط المفرد (Singleton)',
              'نمط المصنع (Factory)'
            ],
            correctAnswer: 2,
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
            text: 'أي من الآتي ليس من مبادئ البرمجة الموجهة للكائنات (OOP)؟',
            options: [
              'التغليف (Encapsulation)',
              'الوراثة (Inheritance)',
              'تعدد الأشكال (Polymorphism)',
              'التزامن (Synchronization)'
            ],
            correctAnswer: 3
          },
          {
            id: 5,
            text: 'ما هو المقصود بـ "فحص صحة البرنامج" (Validation)؟',
            options: [
              'التأكد من أن البرنامج يعمل بشكل صحيح وفقًا للمتطلبات',
              'التأكد من أن البرنامج خالٍ من الأخطاء البرمجية',
              'التأكد من أن البرنامج يتوافق مع معايير الترميز',
              'التأكد من أن البرنامج يعمل بكفاءة'
            ],
            correctAnswer: 0
          }
        ]
      };
      
      setQuiz(mockQuiz);
      // تعيين وقت الاختبار (دقيقتان لكل سؤال)
      setTimeLeft(mockQuiz.questions.length * 120);
      // تهيئة مصفوفة الإجابات المحددة
      setSelectedAnswers(new Array(mockQuiz.questions.length).fill(-1));
      setIsLoading(false);
    };
    
    fetchQuiz();
  }, [id]);
  
  // عداد الوقت
  useEffect(() => {
    if (isLoading || quizSubmitted || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isLoading, quizSubmitted, timeLeft]);
  
  // تنسيق الوقت
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // التعامل مع اختيار إجابة
  const handleAnswerSelect = (answerIndex: number) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newSelectedAnswers);
  };
  
  // إرسال الاختبار
  const handleSubmitQuiz = useCallback(() => {
    if (!quiz) return;
    
    // حساب النتيجة
    let correctCount = 0;
    const questionResults = quiz.questions.map((question, index) => {
      const isCorrect = selectedAnswers[index] === question.correctAnswer;
      if (isCorrect) correctCount++;
      
      return {
        question: question.text,
        userAnswer: selectedAnswers[index] === -1 ? 'لم يتم الإجابة' : question.options[selectedAnswers[index]],
        correctAnswer: question.options[question.correctAnswer],
        isCorrect
      };
    });
    
    const result: QuizResult = {
      correct: correctCount,
      incorrect: quiz.questions.length - correctCount,
      total: quiz.questions.length,
      percentage: Math.round((correctCount / quiz.questions.length) * 100),
      questions: questionResults
    };
    
    setQuizResult(result);
    setQuizSubmitted(true);
  }, [quiz, selectedAnswers]);
  
  // الانتقال إلى السؤال التالي
  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  // الانتقال إلى السؤال السابق
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loader" />
      </div>
    );
  }
  
  if (!quiz) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">الاختبار غير موجود</h1>
          <p className="mt-4 text-lg text-gray-600">
            عذراً، لم يتم العثور على الاختبار المطلوب.
          </p>
          <div className="mt-8">
            <button
              onClick={() => navigate('/resources')}
              className="btn btn-primary flex items-center justify-center mx-auto"
            >
              <Home className="h-5 w-5 ml-1" />
              العودة إلى المصادر
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // عرض نتيجة الاختبار
  if (quizSubmitted && quizResult) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6">
            <h1 className="text-2xl font-bold text-white">نتيجة الاختبار</h1>
            <p className="mt-2 text-primary-100">
              {quiz.title}
            </p>
          </div>
          
          <div className="p-6">
            <div className="mb-8">
              <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-6">
                <div className="w-full md:w-1/3 bg-green-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{quizResult.correct}</div>
                  <div className="text-sm text-gray-600">إجابات صحيحة</div>
                </div>
                
                <div className="w-full md:w-1/3 bg-red-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">{quizResult.incorrect}</div>
                  <div className="text-sm text-gray-600">إجابات خاطئة</div>
                </div>
                
                <div className="w-full md:w-1/3 bg-primary-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">{quizResult.percentage}%</div>
                  <div className="text-sm text-gray-600">النسبة المئوية</div>
                </div>
              </div>
              
              <div className="text-center mb-6">
                <div className={`text-xl font-bold ${
                  quizResult.percentage >= 80 ? 'text-green-600' :
                  quizResult.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                } mb-1`}>
                  {quizResult.percentage >= 80 ? 'ممتاز!' :
                   quizResult.percentage >= 60 ? 'جيد' : 'تحتاج إلى مزيد من الدراسة'}
                </div>
                <p className="text-gray-600">
                  لقد أجبت على {quizResult.correct} من أصل {quizResult.total} أسئلة بشكل صحيح.
                </p>
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-4">مراجعة الإجابات</h2>
            
            <div className="space-y-6">
              {quizResult.questions.map((item, index) => (
                <div key={index} className={`border ${
                  item.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                } rounded-lg p-4`}>
                  <div className="flex items-start">
                    <div className="mt-1">
                      {item.isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
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
                      <p className="text-gray-800 mb-3">{item.question}</p>
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
                onClick={() => navigate('/resources')}
                className="btn btn-primary flex items-center"
              >
                <Home className="h-5 w-5 ml-1" />
                العودة إلى المصادر
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // عرض الاختبار القصير
  const currentQuestion = quiz.questions[currentQuestionIndex];
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">{quiz.title}</h1>
              <p className="mt-1 text-sm text-primary-100">
                السؤال {currentQuestionIndex + 1} من {quiz.questions.length}
              </p>
            </div>
            <div className="mt-2 sm:mt-0 flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full">
              <Clock className="h-5 w-5 text-white ml-1" />
              <span className="text-white font-mono">{formatTime(timeLeft)}</span>
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
                  selectedAnswers[currentQuestionIndex] === index
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => handleAnswerSelect(index)}
              >
                <div className="flex items-center">
                  <div className={`flex-shrink-0 h-5 w-5 rounded-full border ${
                    selectedAnswers[currentQuestionIndex] === index
                      ? 'bg-primary-500 border-primary-500'
                      : 'border-gray-400'
                  } flex items-center justify-center mr-3`}>
                    {selectedAnswers[currentQuestionIndex] === index && (
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className={`text-sm ${
                    selectedAnswers[currentQuestionIndex] === index
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
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className={`btn btn-outline flex items-center ${
                currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ArrowRight className="h-5 w-5 ml-1" />
              السؤال السابق
            </button>
            
            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmitQuiz}
                className="btn btn-primary flex items-center"
              >
                <CheckCircle className="h-5 w-5 ml-1" />
                إنهاء الاختبار
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="btn btn-primary flex items-center"
              >
                السؤال التالي
                <ArrowRight className="h-5 w-5 mr-1 rotate-180" />
              </button>
            )}
          </div>
        </div>
        
        {/* شريط التقدم */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-wrap gap-2 justify-center">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`h-8 w-8 rounded-full flex items-center justify-center text-sm ${
                  index === currentQuestionIndex
                    ? 'bg-primary-600 text-white'
                    : selectedAnswers[index] !== -1
                    ? 'bg-primary-100 text-primary-700 border border-primary-300'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
 