import  { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Menu, X, Server, Book, Users, 
  Home, LogOut, Brain
} from 'lucide-react';

const AdminLayout = () => {
  const { logout, userData } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'لوحة التحكم', icon: <Server className="h-5 w-5 ml-2" /> },
    { path: '/admin/questions', label: 'إدارة الأسئلة', icon: <Book className="h-5 w-5 ml-2" /> },
    { path: '/admin/users', label: 'إدارة المستخدمين', icon: <Users className="h-5 w-5 ml-2" /> },
    { path: '/admin/ai-settings', label: 'إعدادات الذكاء الاصطناعي', icon: <Brain className="h-5 w-5 ml-2" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* شريط التنقل العلوي للمشرف */}
      <header className="bg-white shadow">
        <div className="mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex px-2 lg:px-0">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/admin" className="flex items-center">
                  <Server className="h-8 w-8 text-primary-600" />
                  <span className="mr-2 font-bold text-xl text-gray-900">لوحة التحكم</span>
                </Link>
              </div>
            </div>
            
            <div className="flex items-center lg:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              >
                <span className="sr-only">{isMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
            
            <div className="hidden lg:flex lg:items-center">
              <Link to="/" className="btn btn-outline mx-2">
                <Home className="h-5 w-5 ml-1" />
                الرئيسية
              </Link>
              
              <div className="relative ml-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                    <span className="text-sm font-medium">
                      {userData?.name ? userData.name.charAt(0) : 'A'}
                    </span>
                  </div>
                  <span className="mr-2 text-sm text-gray-700">{userData?.name || 'مشرف'}</span>
                </div>
              </div>
              
              <button
                onClick={logout}
                className="ml-4 btn btn-outline text-gray-700"
              >
                <LogOut className="h-5 w-5 ml-1" />
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* محتوى الصفحة */}
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* القائمة الجانبية - للشاشات الكبيرة */}
            <div className="hidden lg:block lg:col-span-3">
              <nav className="sticky top-6 space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      location.pathname === item.path
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <Link
                    to="/"
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-primary-600"
                  >
                    <Home className="h-5 w-5 ml-2" />
                    العودة للرئيسية
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full flex items-center px-3 py-2 mt-1 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-primary-600"
                  >
                    <LogOut className="h-5 w-5 ml-2" />
                    تسجيل الخروج
                  </button>
                </div>
              </nav>
            </div>
            
            {/* القائمة الجانبية - للشاشات الصغيرة */}
            {isMenuOpen && (
              <div className="fixed inset-0 flex z-40 lg:hidden">
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMenuOpen(false)}></div>
                <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white focus:outline-none">
                  <div className="absolute top-0 left-0 -ml-12 pt-2">
                    <button
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="sr-only">إغلاق</span>
                      <X className="h-6 w-6 text-white" />
                    </button>
                  </div>
                  <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                    <div className="flex-shrink-0 flex items-center px-4">
                      <span className="font-bold text-xl text-gray-900">لوحة التحكم</span>
                    </div>
                    <nav className="mt-5 px-2 space-y-1">
                      {menuItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center px-2 py-2 text-base rounded-md ${
                            location.pathname === item.path
                              ? 'bg-primary-50 text-primary-600'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      ))}
                    </nav>
                  </div>
                  <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                    <Link to="/" className="flex-shrink-0 group block" onClick={() => setIsMenuOpen(false)}>
                      <div className="flex items-center">
                        <div>
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                            <span className="text-lg font-medium">
                              {userData?.name ? userData.name.charAt(0) : 'A'}
                            </span>
                          </div>
                        </div>
                        <div className="mr-3">
                          <p className="text-base font-medium text-gray-700">{userData?.name || 'مشرف'}</p>
                          <button
                            onClick={logout}
                            className="text-sm font-medium text-primary-600 hover:text-primary-500 flex items-center"
                          >
                            <LogOut className="h-4 w-4 ml-1" />
                            تسجيل الخروج
                          </button>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )}
            
            {/* المحتوى الرئيسي */}
            <main className="lg:col-span-9">
              <div className="bg-white shadow rounded-lg">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
 