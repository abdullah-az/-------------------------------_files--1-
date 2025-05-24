import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Video, Link as LinkIcon, File, X, Check, Filter, Search, Download } from 'lucide-react';

// نوع المصدر التعليمي
interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'file' | 'link' | 'video';
  specialization: 'software' | 'networks' | 'ai' | 'general' | 'all';
  url: string;
  size?: string;
  createdAt: string;
}

// نوع الاختبار القصير
interface Quiz {
  id: string;
  title: string;
  description: string;
  specialization: 'software' | 'networks' | 'ai' | 'general';
  questionCount: number;
  timeLimit: number; // بالدقائق
  difficulty: 'easy' | 'medium' | 'hard';
}

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('resources');
  
  useEffect(() => {
    // في بيئة حقيقية، هنا سيتم استدعاء API للحصول على المصادر التعليمية
    const fetchResources = async () => {
      setIsLoading(true);
      
      // محاكاة تأخير الشبكة
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // بيانات تجريبية للمصادر التعليمية
      const mockResources: Resource[] = [
        {
          id: 'res1',
          title: 'مدخل إلى هندسة البرمجيات',
          description: 'ملف PDF يحتوي على مقدمة شاملة لمبادئ هندسة البرمجيات.',
          type: 'file',
          specialization: 'software',
          url: '#',
          size: '3.2 MB',
          createdAt: '2023-05-10T08:30:00'
        },
        {
          id: 'res2',
          title: 'بروتوكولات شبكات الحاسوب',
          description: 'ملف PDF يشرح بروتوكولات TCP/IP ونموذج OSI.',
          type: 'file',
          specialization: 'networks',
          url: '#',
          size: '2.5 MB',
          createdAt: '2023-05-12T10:15:00'
        },
        {
          id: 'res3',
          title: 'مقدمة في الذكاء الاصطناعي وتعلم الآلة',
          description: 'ملف PDF يقدم مدخل إلى مفاهيم الذكاء الاصطناعي وتعلم الآلة.',
          type: 'file',
          specialization: 'ai',
          url: '#',
          size: '4.1 MB',
          createdAt: '2023-05-15T14:20:00'
        },
        {
          id: 'res4',
          title: 'أساسيات هياكل البيانات والخوارزميات',
          description: 'ملف PDF يشرح هياكل البيانات الأساسية والخوارزميات الشائعة.',
          type: 'file',
          specialization: 'general',
          url: '#',
          size: '3.8 MB',
          createdAt: '2023-05-18T09:45:00'
        },
        {
          id: 'res5',
          title: 'كورس فيديو: تطوير واجهات المستخدم',
          description: 'سلسلة فيديوهات تعليمية تشرح أساسيات تطوير واجهات المستخدم.',
          type: 'video',
          specialization: 'software',
          url: 'https://www.youtube.com/watch?v=example',
          createdAt: '2023-05-20T11:30:00'
        },
        {
          id: 'res6',
          title: 'كورس فيديو: أمن الشبكات',
          description: 'سلسلة فيديوهات تعليمية تشرح أساسيات أمن الشبكات وحماية البيانات.',
          type: 'video',
          specialization: 'networks',
          url: 'https://www.youtube.com/watch?v=example',
          createdAt: '2023-05-22T13:10:00'
        },
        {
          id: 'res7',
          title: 'دورة تعلم الشبكات العصبية العميقة',
          description: 'رابط لدورة تعليمية عبر الإنترنت حول الشبكات العصبية العميقة.',
          type: 'link',
          specialization: 'ai',
          url: 'https://www.example.com/course',
          createdAt: '2023-05-25T16:25:00'
        },
        {
          id: 'res8',
          title: 'مختبر أساسيات نظم التشغيل',
          description: 'رابط لمختبر افتراضي لتطبيق مفاهيم نظم التشغيل.',
          type: 'link',
          specialization: 'general',
          url: 'https://www.example.com/lab',
          createdAt: '2023-05-28T10:40:00'
        }
      ];
      
      // بيانات تجريبية للاختبارات القصيرة
      const mockQuizzes: Quiz[] = [
        {
          id: 'quiz1',
          title: 'اختبار أساسيات هندسة البرمجيات',
          description: 'اختبار قصير يغطي المفاهيم الأساسية في هندسة البرمجيات.',
          specialization: 'software',
          questionCount: 10,
          timeLimit: 15,
          difficulty: 'easy'
        },
        {
          id: 'quiz2',
          title: 'اختبار بروتوكولات الشبكات',
          description: 'اختبار قصير يغطي بروتوكولات الشبكات الرئيسية.',
          specialization: 'networks',
          questionCount: 10,
          timeLimit: 15,
          difficulty: 'medium'
        },
        {
          id: 'quiz3',
          title: 'اختبار مفاهيم الذكاء الاصطناعي',
          description: 'اختبار قصير يغطي المفاهيم الأساسية في الذكاء الاصطناعي.',
          specialization: 'ai',
          questionCount: 10,
          timeLimit: 15,
          difficulty: 'medium'
        },
        {
          id: 'quiz4',
          title: 'اختبار هياكل البيانات والخوارزميات',
          description: 'اختبار قصير يغطي هياكل البيانات والخوارزميات الأساسية.',
          specialization: 'general',
          questionCount: 10,
          timeLimit: 15,
          difficulty: 'hard'
        },
        {
          id: 'quiz5',
          title: 'اختبار متقدم في هندسة البرمجيات',
          description: 'اختبار متقدم يغطي مفاهيم هندسة البرمجيات المتقدمة.',
          specialization: 'software',
          questionCount: 15,
          timeLimit: 20,
          difficulty: 'hard'
        },
        {
          id: 'quiz6',
          title: 'اختبار أمن الشبكات',
          description: 'اختبار قصير يغطي مفاهيم أمن الشبكات الأساسية.',
          specialization: 'networks',
          questionCount: 10,
          timeLimit: 15,
          difficulty: 'medium'
        }
      ];
      
      setResources(mockResources);
      setQuizzes(mockQuizzes);
      setIsLoading(false);
    };
    
    fetchResources();
  }, []);
  
  // تصفية المصادر التعليمية بناءً على المعايير المحددة
  const filteredResources = resources.filter(resource => {
    const matchesSpecialization = selectedSpecialization === '' || resource.specialization === selectedSpecialization || resource.specialization === 'all';
    const matchesType = selectedType === '' || resource.type === selectedType;
    const matchesSearch = searchTerm === '' || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSpecialization && matchesType && matchesSearch;
  });
  
  // تصفية الاختبارات القصيرة بناءً على المعايير المحددة
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSpecialization = selectedSpecialization === '' || quiz.specialization === selectedSpecialization;
    const matchesSearch = searchTerm === '' || 
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSpecialization && matchesSearch;
  });
  
  // الحصول على أيقونة نوع المصدر
  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'file':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'video':
        return <Video className="h-5 w-5 text-blue-500" />;
      case 'link':
        return <LinkIcon className="h-5 w-5 text-green-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
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
      case 'all':
        return 'جميع التخصصات';
      default:
        return code;
    }
  };
  
  // الحصول على لون التخصص
  const getSpecializationColor = (code: string) => {
    switch (code) {
      case 'software':
        return 'bg-blue-100 text-blue-800';
      case 'networks':
        return 'bg-green-100 text-green-800';
      case 'ai':
        return 'bg-purple-100 text-purple-800';
      case 'general':
        return 'bg-gray-100 text-gray-800';
      case 'all':
        return 'bg-primary-100 text-primary-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // الحصول على لون مستوى الصعوبة
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6">
          <h1 className="text-2xl font-bold text-white">المصادر التعليمية</h1>
          <p className="mt-2 text-primary-100">
            استكشف مجموعة متنوعة من المصادر التعليمية والاختبارات القصيرة المتعلقة بالهندسة المعلوماتية.
          </p>
        </div>
        
        {/* علامات التبويب */}
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('resources')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'resources'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              المصادر التعليمية
            </button>
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'quizzes'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              الاختبارات القصيرة
            </button>
          </nav>
        </div>
        
        {/* فلاتر البحث */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-grow max-w-md">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                بحث
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="search"
                  placeholder="البحث عن المصادر التعليمية..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                التخصص
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="specialization"
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="block w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">جميع التخصصات</option>
                  <option value="software">هندسة البرمجيات</option>
                  <option value="networks">هندسة الشبكات</option>
                  <option value="ai">الذكاء الاصطناعي</option>
                  <option value="general">التخصص العام</option>
                </select>
              </div>
            </div>
            
            {activeTab === 'resources' && (
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  نوع المصدر
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Filter className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="type"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="block w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">جميع الأنواع</option>
                    <option value="file">ملفات</option>
                    <option value="video">فيديوهات</option>
                    <option value="link">روابط</option>
                  </select>
                </div>
              </div>
            )}
            
            {selectedSpecialization && (
              <div className="mt-4 flex">
                <button 
                  onClick={() => setSelectedSpecialization('')}
                  className="px-3 py-1 bg-primary-100 rounded-full text-sm text-primary-700 flex items-center"
                >
                  {getSpecializationName(selectedSpecialization)}
                  <X className="h-4 w-4 mr-1" />
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* المحتوى */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <span className="loader" />
            </div>
          ) : (
            <>
              {/* المصادر التعليمية */}
              {activeTab === 'resources' && (
                <>
                  {filteredResources.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredResources.map((resource) => (
                        <div key={resource.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                          <div className="p-6">
                            <div className="flex items-center mb-3">
                              {getResourceTypeIcon(resource.type)}
                              <h3 className="text-lg font-medium text-gray-900 mr-2">{resource.title}</h3>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                            <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4 gap-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSpecializationColor(resource.specialization)}`}>
                                {getSpecializationName(resource.specialization)}
                              </span>
                              {resource.size && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {resource.size}
                                </span>
                              )}
                              <span className="inline-flex items-center">
                                <Calendar className="h-4 w-4 ml-1" />
                                {formatDate(resource.createdAt)}
                              </span>
                            </div>
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full btn btn-outline flex justify-center items-center"
                            >
                              {resource.type === 'file' ? (
                                <>
                                  <Download className="h-4 w-4 ml-1" />
                                  تحميل الملف
                                </>
                              ) : resource.type === 'video' ? (
                                <>
                                  <Video className="h-4 w-4 ml-1" />
                                  مشاهدة الفيديو
                                </>
                              ) : (
                                <>
                                  <LinkIcon className="h-4 w-4 ml-1" />
                                  فتح الرابط
                                </>
                              )}
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <File className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">لم يتم العثور على مصادر</h3>
                      <p className="text-gray-500">لم نتمكن من العثور على مصادر تطابق معايير البحث الخاصة بك.</p>
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedSpecialization('');
                          setSelectedType('');
                        }}
                        className="mt-4 btn btn-outline"
                      >
                        إعادة ضبط الفلترة
                      </button>
                    </div>
                  )}
                </>
              )}
              
              {/* الاختبارات القصيرة */}
              {activeTab === 'quizzes' && (
                <>
                  {filteredQuizzes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredQuizzes.map((quiz) => (
                        <div key={quiz.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                          <div className={`h-2 ${
                            quiz.specialization === 'software' ? 'bg-blue-500' :
                            quiz.specialization === 'networks' ? 'bg-green-500' :
                            quiz.specialization === 'ai' ? 'bg-purple-500' : 'bg-gray-500'
                          }`}></div>
                          <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">{quiz.title}</h3>
                            <p className="text-gray-600 text-sm mb-4">{quiz.description}</p>
                            <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4 gap-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSpecializationColor(quiz.specialization)}`}>
                                {getSpecializationName(quiz.specialization)}
                              </span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                                {quiz.difficulty === 'easy' ? 'سهل' : quiz.difficulty === 'medium' ? 'متوسط' : 'صعب'}
                              </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {quiz.questionCount} سؤال
                              </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {quiz.timeLimit} دقيقة
                              </span>
                            </div>
                            <Link
                              to={`/quiz/${quiz.id}`}
                              className="w-full btn btn-primary flex justify-center items-center"
                            >
                              <Check className="h-4 w-4 ml-1" />
                              بدء الاختبار
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <File className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">لم يتم العثور على اختبارات</h3>
                      <p className="text-gray-500">لم نتمكن من العثور على اختبارات قصيرة تطابق معايير البحث الخاصة بك.</p>
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedSpecialization('');
                        }}
                        className="mt-4 btn btn-outline"
                      >
                        إعادة ضبط الفلترة
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Resources;
 