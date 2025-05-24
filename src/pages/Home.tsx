import  { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Book, Monitor, Database, Code, Globe, CheckCircle, Play } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* القسم الرئيسي */}
      <section 
        className="relative bg-cover bg-center py-16 sm:py-24" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url(https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxhcmFiaWMlMjBlZHVjYXRpb24lMjBwbGF0Zm9ybSUyMHVzZXIlMjBpbnRlcmZhY2UlMjBleGFtJTIwZGFzaGJvYXJkfGVufDB8fHx8MTc0NjY2NzQwN3ww&ixlib=rb-4.1.0&fit=fillmax&h=600&w=800)` 
        }}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            منصة امتحان الهندسة المعلوماتية الموحد
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-300">
            منصة تعليمية شاملة تساعدك على التحضير لامتحان الهندسة المعلوماتية الموحد بأربعة تخصصات رئيسية.
          </p>
          <div className="mt-10 flex justify-center">
            {isAuthenticated ? (
              <Link
                to="/exams/start"
                className="btn bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 px-8 py-3 rounded-md shadow-md"
              >
                بدء امتحان
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="btn bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 px-8 py-3 rounded-md shadow-md"
                >
                  إنشاء حساب
                </Link>
                <Link
                  to="/login"
                  className="btn btn-outline bg-white text-gray-800 hover:bg-gray-100 focus:ring-primary-500 px-8 py-3 rounded-md shadow-md"
                >
                  تسجيل الدخول
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* قسم التخصصات */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              التخصصات الرئيسية
            </h2>
            <p className="mt-3 max-w-3xl mx-auto text-lg text-gray-500">
              تغطي المنصة أربعة تخصصات رئيسية في مجال الهندسة المعلوماتية:
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600">
                <Code className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">هندسة البرمجيات</h3>
              <p className="mt-2 text-base text-gray-500">
                تصميم وتطوير البرمجيات، هندسة البرمجيات، قواعد البيانات وتطوير الويب.
              </p>
              <Link
                to="/specialization/software"
                className="mt-4 inline-block text-primary-600 hover:text-primary-500"
              >
                اكتشف المزيد &larr;
              </Link>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-secondary-100 text-secondary-600">
                <Globe className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">هندسة الشبكات</h3>
              <p className="mt-2 text-base text-gray-500">
                بنية الشبكات، بروتوكولات الاتصال، أمن الشبكات، والاتصالات اللاسلكية.
              </p>
              <Link
                to="/specialization/networks"
                className="mt-4 inline-block text-secondary-600 hover:text-secondary-500"
              >
                اكتشف المزيد &larr;
              </Link>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600">
                <Monitor className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">الذكاء الاصطناعي</h3>
              <p className="mt-2 text-base text-gray-500">
                التعلم الآلي، الشبكات العصبية، معالجة اللغات الطبيعية والرؤية الحاسوبية.
              </p>
              <Link
                to="/specialization/ai"
                className="mt-4 inline-block text-primary-600 hover:text-primary-500"
              >
                اكتشف المزيد &larr;
              </Link>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-secondary-100 text-secondary-600">
                <Database className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">التخصص العام</h3>
              <p className="mt-2 text-base text-gray-500">
                أساسيات الحوسبة، الخوارزميات، هياكل البيانات، ونظم التشغيل.
              </p>
              <Link
                to="/specialization/general"
                className="mt-4 inline-block text-secondary-600 hover:text-secondary-500"
              >
                اكتشف المزيد &larr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* قسم المميزات */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              مميزات المنصة
            </h2>
            <p className="mt-3 max-w-3xl mx-auto text-lg text-gray-500">
              تقدم المنصة مجموعة من المميزات التي تساعدك على التحضير بفعالية للامتحان الموحد.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="bg-white rounded-lg p-0 shadow-sm overflow-hidden">
              <div className="h-56 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwzfHxhcmFiaWMlMjBlZHVjYXRpb24lMjBwbGF0Zm9ybSUyMHVzZXIlMjBpbnRlcmZhY2UlMjBleGFtJTIwZGFzaGJvYXJkfGVufDB8fHx8MTc0NjY2NzQwN3ww" 
                  alt="منصة تعليمية للامتحان الموحد" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">بنك أسئلة متكامل</h3>
                <p className="text-gray-600">
                  يتضمن آلاف الأسئلة المصنفة حسب التخصص والموضوع، مع إجابات مفصلة وشروحات متعمقة تساعدك على فهم المفاهيم بشكل أفضل.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-0 shadow-sm overflow-hidden">
              <div className="h-56 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1519452575417-564c1401ecc0?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwyfHxhcmFiaWMlMjBlZHVjYXRpb24lMjBwbGF0Zm9ybSUyMHVzZXIlMjBpbnRlcmZhY2UlMjBleGFtJTIwZGFzaGJvYXJkfGVufDB8fHx8MTc0NjY2NzQwN3ww" 
                  alt="دراسة وتعلم الهندسة المعلوماتية" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">تتبع تقدمك</h3>
                <p className="text-gray-600">
                  لوحة تحكم شخصية تمكنك من متابعة تقدمك في كل تخصص، مع إحصائيات وتحليلات تساعدك على معرفة نقاط القوة والضعف.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-3">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <Book className="h-6 w-6 text-primary-600 ml-2" />
                <h3 className="text-lg font-medium text-gray-900">مصادر تعليمية</h3>
              </div>
              <p className="text-gray-500">
                مجموعة متنوعة من الملفات التعليمية والمراجع في مختلف التخصصات.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <Monitor className="h-6 w-6 text-primary-600 ml-2" />
                <h3 className="text-lg font-medium text-gray-900">امتحانات تجريبية</h3>
              </div>
              <p className="text-gray-500">
                اختبارات محاكية للامتحان الحقيقي، مع تصحيح فوري وتحليل للأداء بعد كل اختبار.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <Database className="h-6 w-6 text-primary-600 ml-2" />
                <h3 className="text-lg font-medium text-gray-900">اختبارات قصيرة</h3>
              </div>
              <p className="text-gray-500">
                اختبارات سريعة لتقييم مستواك في موضوعات محددة، مما يساعدك على التركيز في دراستك.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* دعوة للعمل */}
      <section className="py-12 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            ابدأ التحضير للامتحان الآن
          </h2>
          <p className="mt-3 max-w-md mx-auto text-lg text-primary-100">
            انضم إلى آلاف الطلاب الذين يستعدون لامتحان الهندسة المعلوماتية الموحد.
          </p>
          <div className="mt-8">
            {isAuthenticated ? (
              <Link
                to="/exams/start"
                className="btn bg-white text-primary-700 hover:bg-gray-100 focus:ring-white px-6 py-3 rounded-md shadow-md flex items-center justify-center mx-auto w-48"
              >
                <Play className="h-5 w-5 ml-1" />
                بدء امتحان تجريبي
              </Link>
            ) : (
              <Link
                to="/register"
                className="btn bg-white text-primary-700 hover:bg-gray-100 focus:ring-white px-6 py-3 rounded-md shadow-md flex items-center justify-center mx-auto w-48"
              >
                <CheckCircle className="h-5 w-5 ml-1" />
                سجل مجاناً الآن
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
 