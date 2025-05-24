import  { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut, Book, Home, HelpCircle, Server } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, userRole, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // إغلاق القوائم عند التنقل بين الصفحات
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [navigate]);

  return (
    <nav className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link to="/" className="flex items-center">
                <Book className="h-8 w-8 text-primary-600" />
                <span className="mr-2 text-xl font-bold text-gray-900">امتحان الهندسة</span>
              </Link>
            </div>
            
            {/* القائمة الرئيسية - للشاشات الكبيرة */}
            <div className="hidden sm:mr-6 sm:flex sm:space-x-8 sm:space-x-reverse">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? 'border-primary-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                }
              >
                الرئيسية
              </NavLink>
              
              {isAuthenticated && (
                <>
                  <NavLink
                    to="/specialization/software"
                    className={({ isActive }) =>
                      isActive
                        ? 'border-primary-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                    }
                  >
                    هندسة البرمجيات
                  </NavLink>
                  
                  <NavLink
                    to="/specialization/networks"
                    className={({ isActive }) =>
                      isActive
                        ? 'border-primary-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                    }
                  >
                    هندسة الشبكات
                  </NavLink>
                  
                  <NavLink
                    to="/specialization/ai"
                    className={({ isActive }) =>
                      isActive
                        ? 'border-primary-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                    }
                  >
                    الذكاء الاصطناعي
                  </NavLink>
                  
                  <NavLink
                    to="/specialization/general"
                    className={({ isActive }) =>
                      isActive
                        ? 'border-primary-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                    }
                  >
                    التخصص العام
                  </NavLink>
                </>
              )}
              
              {isAuthenticated && (
                <NavLink
                  to="/resources"
                  className={({ isActive }) =>
                    isActive
                      ? 'border-primary-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                  }
                >
                  المصادر
                </NavLink>
              )}
            </div>
          </div>
          
          {/* قائمة المستخدم - للشاشات الكبيرة */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <div className="relative ml-3">
                <div>
                  <button
                    type="button"
                    className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  >
                    <span className="sr-only">فتح قائمة المستخدم</span>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                        <User className="h-5 w-5" />
                      </div>
                      <span className="text-gray-700 mr-2 text-sm">حسابي</span>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </div>
                  </button>
                </div>
                
                {isProfileDropdownOpen && (
                  <div className="absolute left-0 z-10 mt-2 w-48 origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {userRole === 'admin' && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <Server className="h-4 w-4 ml-2" />
                          لوحة التحكم
                        </div>
                      </Link>
                    )}
                    
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <div className="flex items-center">
                        <User className="h-4 w-4 ml-2" />
                        الملف الشخصي
                      </div>
                    </Link>
                    
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <LogOut className="h-4 w-4 ml-2" />
                        تسجيل الخروج
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4 space-x-reverse">
                <Link to="/login" className="btn btn-primary">
                  تسجيل الدخول
                </Link>
                <Link to="/register" className="btn btn-outline">
                  إنشاء حساب
                </Link>
              </div>
            )}
          </div>
          
          {/* زر القائمة - للشاشات الصغيرة */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">{isMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}</span>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* القائمة للشاشات الصغيرة */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? 'bg-primary-100 text-primary-600 block px-3 py-2 rounded-md text-base font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium'
              }
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <Home className="h-5 w-5 ml-2" />
                الرئيسية
              </div>
            </NavLink>
            
            {isAuthenticated && (
              <>
                <NavLink
                  to="/specialization/software"
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-primary-100 text-primary-600 block px-3 py-2 rounded-md text-base font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium'
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Book className="h-5 w-5 ml-2" />
                    هندسة البرمجيات
                  </div>
                </NavLink>
                
                <NavLink
                  to="/specialization/networks"
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-primary-100 text-primary-600 block px-3 py-2 rounded-md text-base font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium'
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Book className="h-5 w-5 ml-2" />
                    هندسة الشبكات
                  </div>
                </NavLink>
                
                <NavLink
                  to="/specialization/ai"
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-primary-100 text-primary-600 block px-3 py-2 rounded-md text-base font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium'
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Book className="h-5 w-5 ml-2" />
                    الذكاء الاصطناعي
                  </div>
                </NavLink>
                
                <NavLink
                  to="/specialization/general"
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-primary-100 text-primary-600 block px-3 py-2 rounded-md text-base font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium'
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Book className="h-5 w-5 ml-2" />
                    التخصص العام
                  </div>
                </NavLink>
                
                <NavLink
                  to="/resources"
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-primary-100 text-primary-600 block px-3 py-2 rounded-md text-base font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium'
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <HelpCircle className="h-5 w-5 ml-2" />
                    المصادر
                  </div>
                </NavLink>
              </>
            )}

            {isAuthenticated ? (
              <>
                <div className="border-t border-gray-200 pt-4 pb-2">
                  <div className="px-4">
                    <p className="text-xs font-medium text-gray-500">الحساب</p>
                  </div>
                </div>
                
                {userRole === 'admin' && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-primary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <Server className="h-5 w-5 ml-2" />
                      لوحة التحكم
                    </div>
                  </Link>
                )}
                
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <User className="h-5 w-5 ml-2" />
                    الملف الشخصي
                  </div>
                </Link>
                
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-right px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-primary-600"
                >
                  <div className="flex items-center">
                    <LogOut className="h-5 w-5 ml-2" />
                    تسجيل الخروج
                  </div>
                </button>
              </>
            ) : (
              <div className="mt-4 space-y-2 px-3">
                <Link
                  to="/login"
                  className="block w-full btn btn-primary py-2 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  تسجيل الدخول
                </Link>
                <Link
                  to="/register"
                  className="block w-full btn btn-outline py-2 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  إنشاء حساب
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
 