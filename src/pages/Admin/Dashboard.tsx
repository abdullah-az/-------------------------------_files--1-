import  { useEffect, useState } from 'react';
import { 
  Users, Book, HelpCircle, 
  CheckCircle, ArrowUp, 
  Clock, Database
} from 'lucide-react';

interface ActivityItem {
  id: number;
  user: string;
  action: string;
  target: string;
  time: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    questions: 0,
    users: 0,
    exams: 0,
    specializations: 4
  });
  
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // في بيئة حقيقية، هنا يتم استدعاء API
    const fetchData = async () => {
      setIsLoading(true);
      
      // محاكاة تأخير الشبكة
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // بيانات تجريبية
      setStats({
        questions: 1245,
        users: 378,
        exams: 920,
        specializations: 4
      });
      
      setActivity([
        {
          id: 1,
          user: 'أحمد محمد',
          action: 'أضاف سؤالاً جديداً',
          target: 'هندسة البرمجيات',
          time: '2023-06-18T10:30:00'
        },
        {
          id: 2,
          user: 'سارة خالد',
          action: 'أكملت امتحان',
          target: 'هندسة الشبكات',
          time: '2023-06-18T09:45:00'
        },
        {
          id: 3,
          user: 'عمر أحمد',
          action: 'سجل حساب جديد',
          target: '',
          time: '2023-06-18T09:20:00'
        },
        {
          id: 4,
          user: 'مشرف النظام',
          action: 'عدل سؤالاً',
          target: 'الذكاء الاصطناعي',
          time: '2023-06-18T08:15:00'
        },
        {
          id: 5,
          user: 'فاطمة علي',
          action: 'أكملت امتحان',
          target: 'التخصص العام',
          time: '2023-06-17T22:10:00'
        }
      ]);
      
      setIsLoading(false);
    };
    
    fetchData();
  }, []);
  
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
      <div className="p-6 flex justify-center">
        <span className="loader" />
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
        <p className="mt-1 text-sm text-gray-500">مرحباً بك في لوحة تحكم منصة امتحان الهندسة المعلوماتية الموحد.</p>
      </div>
      
      {/* الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600">
              <Book className="h-6 w-6" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-500">عدد الأسئلة</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.questions}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUp className="h-4 w-4 text-green-500 ml-1" />
            <span className="text-green-500 mr-1">12%</span>
            <span className="text-gray-500">منذ الشهر الماضي</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-secondary-100 text-secondary-600">
              <Users className="h-6 w-6" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-500">المستخدمين</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.users}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUp className="h-4 w-4 text-green-500 ml-1" />
            <span className="text-green-500 mr-1">8%</span>
            <span className="text-gray-500">منذ الشهر الماضي</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-500">الامتحانات المنجزة</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.exams}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUp className="h-4 w-4 text-green-500 ml-1" />
            <span className="text-green-500 mr-1">24%</span>
            <span className="text-gray-500">منذ الشهر الماضي</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-secondary-100 text-secondary-600">
              <Database className="h-6 w-6" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-500">التخصصات</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.specializations}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">هندسة البرمجيات، هندسة الشبكات، الذكاء الاصطناعي، التخصص العام</span>
          </div>
        </div>
      </div>
      
      {/* آخر النشاطات */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">آخر النشاطات</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {activity.map((item) => (
              <li key={item.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-primary-600 truncate">
                      {item.user}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {formatDate(item.time)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {item.action}
                        {item.target && (
                          <span className="mr-1">في {item.target}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* الأنشطة الأخيرة - مخطط بياني */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">نشاط الامتحانات</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-medium text-gray-700">الامتحانات المكتملة هذا الشهر</h3>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 ml-1" />
              <span>آخر تحديث: {formatDate(new Date().toISOString())}</span>
            </div>
          </div>
          
          <div className="relative">
            <div className="h-48 flex items-end space-x-2 rtl:space-x-reverse">
              {[65, 45, 72, 85, 56, 35, 63, 78, 52, 43, 68, 74, 36, 42, 58, 69, 72, 83, 56, 42, 55, 63, 75, 80, 53, 34, 56, 78, 64, 52].map((value, index) => (
                <div
                  key={index}
                  className="bg-primary-500 rounded-t-md"
                  style={{
                    height: `${value}%`,
                    width: '2.5%',
                    marginLeft: '1%',
                    opacity: 0.8 + (index % 3) * 0.1,
                  }}
                ></div>
              ))}
            </div>
            <div className="h-px w-full bg-gray-200 mt-2"></div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>1</span>
              <span>10</span>
              <span>20</span>
              <span>30</span>
            </div>
          </div>
          
          <div className="flex justify-between mt-6">
            <div className="text-center">
              <span className="text-xs text-gray-500">متوسط الدرجات</span>
              <p className="text-lg font-semibold text-gray-900">78%</p>
            </div>
            <div className="text-center">
              <span className="text-xs text-gray-500">أعلى درجة</span>
              <p className="text-lg font-semibold text-gray-900">97%</p>
            </div>
            <div className="text-center">
              <span className="text-xs text-gray-500">أدنى درجة</span>
              <p className="text-lg font-semibold text-gray-900">42%</p>
            </div>
            <div className="text-center">
              <span className="text-xs text-gray-500">معدل الإكمال</span>
              <p className="text-lg font-semibold text-gray-900">85%</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* روابط سريعة */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">روابط سريعة</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a 
            href="/admin/questions" 
            className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
          >
            <div className="flex items-center">
              <Book className="h-6 w-6 text-primary-600 ml-2" />
              <h3 className="text-base font-medium text-gray-900">إدارة الأسئلة</h3>
            </div>
            <p className="mt-2 text-sm text-gray-500">إضافة وتعديل أسئلة في مختلف التخصصات.</p>
          </a>
          
          <a 
            href="/admin/users" 
            className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
          >
            <div className="flex items-center">
              <Users className="h-6 w-6 text-primary-600 ml-2" />
              <h3 className="text-base font-medium text-gray-900">إدارة المستخدمين</h3>
            </div>
            <p className="mt-2 text-sm text-gray-500">إدارة حسابات المستخدمين والمشرفين.</p>
          </a>
          
          <a 
            href="/" 
            className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
          >
            <div className="flex items-center">
              <HelpCircle className="h-6 w-6 text-primary-600 ml-2" />
              <h3 className="text-base font-medium text-gray-900">العودة للموقع</h3>
            </div>
            <p className="mt-2 text-sm text-gray-500">العودة إلى الصفحة الرئيسية للمنصة.</p>
          </a>

          <a 
            href="/admin/ai-settings" 
            className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
          >
            <div className="flex items-center">
              {/* Using Database icon as a placeholder for AI/Cog icon */}
              <Database className="h-6 w-6 text-primary-600 ml-2" /> 
              <h3 className="text-base font-medium text-gray-900">إعدادات نماذج AI</h3>
            </div>
            <p className="mt-2 text-sm text-gray-500">إدارة وتكوين نماذج الذكاء الاصطناعي.</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
 