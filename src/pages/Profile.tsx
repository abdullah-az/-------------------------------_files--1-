import  { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Book, Calendar, Edit, List, CheckCircle, BarChart } from 'lucide-react';
import ExamHistory from '../components/ExamHistory';

const Profile = () => {
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [progress, setProgress] = useState<any[]>([]);
  const [stats, setStats] = useState({
    examsCompleted: 0,
    quizzesTaken: 0,
    avgScore: 0,
    softwareProgress: 0,
    networksProgress: 0,
    aiProgress: 0,
    generalProgress: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // في بيئة حقيقية، هنا سيتم استدعاء API للحصول على بيانات الملف الشخصي
    const fetchProfileData = async () => {
      setIsLoading(true);
      
      // محاكاة تأخير الشبكة
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // بيانات تجريبية للتقدم
      const mockProgress = [
        {
          id: 'p1',
          title: 'امتحان هندسة البرمجيات الشامل',
          type: 'exam',
          specialization: 'software',
          lastAccessed: '2023-06-15T14:30:00',
          progress: 100,
          score: 90
        },
        {
          id: 'p2',
          title: 'امتحان هندسة الشبكات الأساسي',
          type: 'exam',
          specialization: 'networks',
          lastAccessed: '2023-06-10T10:15:00',
          progress: 100,
          score: 75
        },
        {
          id: 'p3',
          title: 'اختبار الذكاء الاصطناعي القصير',
          type: 'quiz',
          specialization: 'ai',
          lastAccessed: '2023-06-05T16:45:00',
          progress: 100,
          score: 80
        },
        {
          id: 'p4',
          title: 'دورة أساسيات هندسة البرمجيات',
          type: 'course',
          specialization: 'software',
          lastAccessed: '2023-06-08T11:20:00',
          progress: 65,
          score: null
        }
      ];
      
      // بيانات تجريبية للإحصائيات
      const mockStats = {
        examsCompleted: 5,
        quizzesTaken: 12,
        avgScore: 78,
        softwareProgress: 75,
        networksProgress: 60,
        aiProgress: 45,
        generalProgress: 30
      };
      
      setProgress(mockProgress);
      setStats(mockStats);
      setIsLoading(false);
    };
    
    fetchProfileData();
  }, []);
  
  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <span className="loader" />
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* رأس الملف الشخصي */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0">
            <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center text-primary-600 text-2xl font-bold">
              {userData?.name ? userData.name.charAt(0) : 'U'}
            </div>
            <div className="sm:mr-8 text-center sm:text-right">
              <h1 className="text-2xl font-bold text-white">{userData?.name || 'المستخدم'}</h1>
              <p className="text-primary-100">{userData?.email || 'user@example.com'}</p>
              {userData?.university && userData?.specialty && (
                <p className="mt-1 text-primary-100">
                  {userData.university} - {userData.specialty}
                </p>
              )}
              <button className="mt-4 btn bg-white text-primary-600 hover:bg-primary-50 flex items-center space-x-1 space-x-reverse">
                <Edit className="h-4 w-4 ml-1" />
                <span>تعديل الملف الشخصي</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* علامات التبويب */}
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'overview'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              نظرة عامة
            </button>
            <button
              onClick={() => setActiveTab('exams')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'exams'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              الامتحانات
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'progress'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              التقدم
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'settings'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              الإعدادات
            </button>
          </nav>
        </div>
        
        {/* المحتوى */}
        <div className="p-6">
          {/* نظرة عامة */}
          {activeTab === 'overview' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <div className="mr-4">
                      <p className="text-sm font-medium text-gray-500">الامتحانات المكتملة</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.examsCompleted}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-lg bg-secondary-100 flex items-center justify-center text-secondary-600">
                      <List className="h-6 w-6" />
                    </div>
                    <div className="mr-4">
                      <p className="text-sm font-medium text-gray-500">الاختبارات القصيرة</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.quizzesTaken}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
                      <BarChart className="h-6 w-6" />
                    </div>
                    <div className="mr-4">
                      <p className="text-sm font-medium text-gray-500">متوسط الدرجات</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.avgScore}%</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-lg bg-secondary-100 flex items-center justify-center text-secondary-600">
                      <Book className="h-6 w-6" />
                    </div>
                    <div className="mr-4">
                      <p className="text-sm font-medium text-gray-500">التخصصات النشطة</p>
                      <p className="text-2xl font-semibold text-gray-900">4</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-4">آخر النشاطات</h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 divide-y divide-gray-200">
                {progress.map((item) => (
                  <div key={item.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0 pt-4 first:pt-0">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        {item.type === 'course' ? (
                          <Book className="h-5 w-5 text-primary-600" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-secondary-600" />
                        )}
                        <h3 className="text-lg font-medium text-gray-900 mr-2">{item.title}</h3>
                      </div>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Calendar className="h-4 w-4 ml-1" />
                        آخر نشاط: {formatDate(item.lastAccessed)}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 ml-2">
                        {item.type === 'course' ? 'تقدم الدورة:' : 'النتيجة:'}
                      </span>
                      {item.type === 'course' ? (
                        <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-2 bg-primary-600 rounded-full"
                            style={{ width: `${item.progress}%` }}
                          ></div>
                        </div>
                      ) : (
                        <span className="text-sm font-medium">
                          {item.score}%
                        </span>
                      )}
                      <span className="text-sm text-gray-500 mr-2">
                        {item.type === 'course' ? `${item.progress}%` : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">تقدم التخصصات</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-900">هندسة البرمجيات</h3>
                    <span className="text-sm font-medium text-primary-600">{stats.softwareProgress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-2 bg-blue-600 rounded-full" 
                      style={{ width: `${stats.softwareProgress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-900">هندسة الشبكات</h3>
                    <span className="text-sm font-medium text-primary-600">{stats.networksProgress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-2 bg-green-600 rounded-full" 
                      style={{ width: `${stats.networksProgress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-900">الذكاء الاصطناعي</h3>
                    <span className="text-sm font-medium text-primary-600">{stats.aiProgress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-2 bg-purple-600 rounded-full" 
                      style={{ width: `${stats.aiProgress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-900">التخصص العام</h3>
                    <span className="text-sm font-medium text-primary-600">{stats.generalProgress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-2 bg-gray-600 rounded-full" 
                      style={{ width: `${stats.generalProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* الامتحانات */}
          {activeTab === 'exams' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">سجل الامتحانات</h2>
              <ExamHistory />
            </div>
          )}
          
          {/* التقدم */}
          {activeTab === 'progress' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">تقدمك في التخصصات</h2>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-6">هندسة البرمجيات</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">أساسيات هندسة البرمجيات</span>
                      <span className="text-sm font-medium text-primary-600">90%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-2 bg-blue-600 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">قواعد البيانات</span>
                      <span className="text-sm font-medium text-primary-600">75%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-2 bg-blue-600 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">تحليل وتصميم النظم</span>
                      <span className="text-sm font-medium text-primary-600">60%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-2 bg-blue-600 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">إدارة مشاريع البرمجيات</span>
                      <span className="text-sm font-medium text-primary-600">40%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-2 bg-blue-600 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">اختبار البرمجيات</span>
                      <span className="text-sm font-medium text-primary-600">25%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-2 bg-blue-600 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-6">هندسة الشبكات</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">أساسيات شبكات الحاسوب</span>
                      <span className="text-sm font-medium text-primary-600">80%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-2 bg-green-600 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">بروتوكولات الشبكات</span>
                      <span className="text-sm font-medium text-primary-600">65%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-2 bg-green-600 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">أمن الشبكات</span>
                      <span className="text-sm font-medium text-primary-600">45%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-2 bg-green-600 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">الشبكات اللاسلكية</span>
                      <span className="text-sm font-medium text-primary-600">30%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-2 bg-green-600 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-primary-50 border-r-4 border-primary-500 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">نصائح لتحسين أدائك</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>ركز على إكمال الموضوعات التي لديك تقدم أقل فيها</li>
                  <li>حاول أن تحل الامتحانات التجريبية بانتظام لتقييم مستواك</li>
                  <li>استفد من المصادر التعليمية المتاحة في التخصصات المختلفة</li>
                  <li>راجع الإجابات الخاطئة لفهم أخطائك وتجنبها في المستقبل</li>
                </ul>
              </div>
            </div>
          )}
          
          {/* الإعدادات */}
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">إعدادات الحساب</h2>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">المعلومات الشخصية</h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        الاسم الكامل
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        defaultValue={userData?.name || ''}
                        className="form-input"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        البريد الإلكتروني
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        defaultValue={userData?.email || ''}
                        className="form-input"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">
                        الجامعة
                      </label>
                      <input
                        type="text"
                        id="university"
                        name="university"
                        defaultValue={userData?.university || ''}
                        className="form-input"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
                        التخصص
                      </label>
                      <input
                        type="text"
                        id="specialty"
                        name="specialty"
                        defaultValue={userData?.specialty || ''}
                        className="form-input"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button type="submit" className="btn btn-primary">
                      حفظ التغييرات
                    </button>
                  </div>
                </form>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">تغيير كلمة المرور</h3>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      كلمة المرور الحالية
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      className="form-input"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      كلمة المرور الجديدة
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      className="form-input"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      تأكيد كلمة المرور الجديدة
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="form-input"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <button type="submit" className="btn btn-primary">
                      تغيير كلمة المرور
                    </button>
                  </div>
                </form>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">إعدادات الإشعارات</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-medium text-gray-900">إشعارات البريد الإلكتروني</h4>
                      <p className="text-sm text-gray-500">استلام إشعارات عبر البريد الإلكتروني</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-medium text-gray-900">إشعارات الامتحانات الجديدة</h4>
                      <p className="text-sm text-gray-500">الإشعار عند إضافة امتحانات جديدة</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-medium text-gray-900">تذكيرات المواعيد</h4>
                      <p className="text-sm text-gray-500">تذكير بمواعيد الامتحانات القادمة</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex justify-end">
                    <button type="button" className="btn btn-primary">
                      حفظ التغييرات
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
 