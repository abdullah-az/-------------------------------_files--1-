import  { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Book, Globe, Monitor, Database, FileText, Video, Link as LinkIcon, Code } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SpecializationData {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  banner: string;
  topics: Topic[];
  resources: Resource[];
}

interface Topic {
  id: string;
  title: string;
  description: string;
}

interface Resource {
  id: string;
  title: string;
  type: 'file' | 'link' | 'video';
  url: string;
}

const Specialization = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const [specializationData, setSpecializationData] = useState<SpecializationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    // في بيئة حقيقية، هنا سيتم استدعاء API للحصول على بيانات التخصص
    const fetchSpecializationData = async () => {
      setIsLoading(true);
      
      // محاكاة تأخير الشبكة
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // تحديد أيقونة التخصص بناءً على المعرف
      let icon;
      let banner;
      
      switch (id) {
        case 'software':
          icon = <Code className="h-8 w-8 text-blue-600" />;
          banner = "https://images.unsplash.com/photo-1690226613377-aa7c2facb58d?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb25hbCUyMHBsYXRmb3JtJTIwYXJhYmljJTIwdXNlciUyMGludGVyZmFjZSUyMGV4YW0lMjBkYXNoYm9hcmR8ZW58MHx8fHwxNzQ2NTM4MzAzfDA";
          break;
        case 'networks':
          icon = <Globe className="h-8 w-8 text-green-600" />;
          banner = "https://images.unsplash.com/photo-1690226610870-fef59feef9ea?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwyfHxlZHVjYXRpb25hbCUyMHBsYXRmb3JtJTIwYXJhYmljJTIwdXNlciUyMGludGVyZmFjZSUyMGV4YW0lMjBkYXNoYm9hcmR8ZW58MHx8fHwxNzQ2NTM4MzAzfDA";
          break;
        case 'ai':
          icon = <Monitor className="h-8 w-8 text-purple-600" />;
          banner = "https://images.unsplash.com/photo-1495420233471-7ff3f397d22f?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw1fHxlZHVjYXRpb25hbCUyMHBsYXRmb3JtJTIwYXJhYmljJTIwdXNlciUyMGludGVyZmFjZSUyMGV4YW0lMjBkYXNoYm9hcmR8ZW58MHx8fHwxNzQ2NTM4MzAzfDA";
          break;
        case 'general':
          icon = <Database className="h-8 w-8 text-gray-600" />;
          banner = "https://images.unsplash.com/photo-1517098343-2547f8016001?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw0fHxlZHVjYXRpb25hbCUyMHBsYXRmb3JtJTIwYXJhYmljJTIwdXNlciUyMGludGVyZmFjZSUyMGV4YW0lMjBkYXNoYm9hcmR8ZW58MHx8fHwxNzQ2NTM4MzAzfDA";
          break;
        default:
          icon = <Book className="h-8 w-8 text-gray-600" />;
          banner = "";
      }
      
      // بيانات تجريبية للتخصصات
      const specializations: Record<string, SpecializationData> = {
        'software': {
          id: 'software',
          title: 'هندسة البرمجيات',
          description: 'هندسة البرمجيات هي فرع من فروع الهندسة المعلوماتية يهتم بتطوير وتصميم وصيانة البرمجيات. يتضمن هذا التخصص دراسة مبادئ هندسة البرمجيات، نماذج دورة حياة تطوير البرمجيات، قواعد البيانات، وأساليب تحليل وتصميم النظم.',
          icon,
          banner,
          topics: [
            {
              id: 'soft1',
              title: 'أساسيات هندسة البرمجيات',
              description: 'مقدمة في هندسة البرمجيات، المفاهيم الأساسية، دورة حياة تطوير البرمجيات.'
            },
            {
              id: 'soft2',
              title: 'قواعد البيانات',
              description: 'مفاهيم قواعد البيانات العلائقية، لغة SQL، تصميم قواعد البيانات.'
            },
            {
              id: 'soft3',
              title: 'تحليل وتصميم النظم',
              description: 'طرق تحليل النظم، نمذجة UML، تصميم البرمجيات.'
            },
            {
              id: 'soft4',
              title: 'إدارة مشاريع البرمجيات',
              description: 'تخطيط المشاريع، إدارة المخاطر، ضمان الجودة، أدوات إدارة المشاريع.'
            },
            {
              id: 'soft5',
              title: 'اختبار البرمجيات',
              description: 'أنواع الاختبارات، استراتيجيات الاختبار، أتمتة الاختبار.'
            }
          ],
          resources: [
            {
              id: 'sres1',
              title: 'مدخل إلى هندسة البرمجيات',
              type: 'file',
              url: '#'
            },
            {
              id: 'sres2',
              title: 'قواعد البيانات العلائقية وSQL',
              type: 'file',
              url: '#'
            },
            {
              id: 'sres3',
              title: 'كورس فيديو: تحليل وتصميم النظم',
              type: 'video',
              url: '#'
            }
          ]
        },
        'networks': {
          id: 'networks',
          title: 'هندسة الشبكات',
          description: 'هندسة الشبكات هي تخصص يهتم بتصميم وبناء وإدارة شبكات الحاسوب. يشمل هذا التخصص دراسة بروتوكولات الاتصال، أمن الشبكات، البنية التحتية للشبكات، والشبكات اللاسلكية.',
          icon,
          banner,
          topics: [
            {
              id: 'net1',
              title: 'أساسيات شبكات الحاسوب',
              description: 'مقدمة في شبكات الحاسوب، نماذج OSI وTCP/IP، الأجهزة الأساسية في الشبكات.'
            },
            {
              id: 'net2',
              title: 'بروتوكولات الشبكات',
              description: 'بروتوكولات TCP/IP، UDP، HTTP، DNS، وغيرها.'
            },
            {
              id: 'net3',
              title: 'أمن الشبكات',
              description: 'مبادئ أمن الشبكات، التشفير، جدران الحماية، VPN، وكشف التسلل.'
            },
            {
              id: 'net4',
              title: 'الشبكات اللاسلكية',
              description: 'تقنيات الشبكات اللاسلكية، IEEE 802.11، أمن الشبكات اللاسلكية.'
            },
            {
              id: 'net5',
              title: 'إدارة الشبكات',
              description: 'أدوات ومفاهيم إدارة الشبكات، بروتوكول SNMP، مراقبة أداء الشبكة.'
            }
          ],
          resources: [
            {
              id: 'nres1',
              title: 'مدخل إلى شبكات الحاسوب',
              type: 'file',
              url: '#'
            },
            {
              id: 'nres2',
              title: 'فيديو: بروتوكول TCP/IP',
              type: 'video',
              url: '#'
            },
            {
              id: 'nres3',
              title: 'مبادئ أمن الشبكات',
              type: 'file',
              url: '#'
            }
          ]
        },
        'ai': {
          id: 'ai',
          title: 'الذكاء الاصطناعي',
          description: 'الذكاء الاصطناعي هو مجال في علوم الحاسوب يركز على تطوير أنظمة قادرة على أداء مهام تتطلب ذكاءً بشرياً. يشمل هذا التخصص دراسة التعلم الآلي، الشبكات العصبية، معالجة اللغات الطبيعية، والرؤية الحاسوبية.',
          icon,
          banner,
          topics: [
            {
              id: 'ai1',
              title: 'مقدمة في الذكاء الاصطناعي',
              description: 'تاريخ الذكاء الاصطناعي، المفاهيم الأساسية، التطبيقات الحالية والمستقبلية.'
            },
            {
              id: 'ai2',
              title: 'التعلم الآلي',
              description: 'خوارزميات التعلم الآلي، التعلم الخاضع للإشراف وغير الخاضع للإشراف، تقييم النماذج.'
            },
            {
              id: 'ai3',
              title: 'الشبكات العصبية والتعلم العميق',
              description: 'أساسيات الشبكات العصبية، شبكات CNN وRNN، تطبيقات التعلم العميق.'
            },
            {
              id: 'ai4',
              title: 'معالجة اللغات الطبيعية',
              description: 'تحليل النصوص، استخراج المعلومات، تحليل المشاعر، الترجمة الآلية.'
            },
            {
              id: 'ai5',
              title: 'الرؤية الحاسوبية',
              description: 'معالجة الصور، تحليل الفيديو، التعرف على الأشياء، تطبيقات الرؤية الحاسوبية.'
            }
          ],
          resources: [
            {
              id: 'aires1',
              title: 'مدخل إلى التعلم الآلي',
              type: 'file',
              url: '#'
            },
            {
              id: 'aires2',
              title: 'فيديو: الشبكات العصبية العميقة',
              type: 'video',
              url: '#'
            },
            {
              id: 'aires3',
              title: 'مراجع معالجة اللغات الطبيعية',
              type: 'link',
              url: '#'
            }
          ]
        },
        'general': {
          id: 'general',
          title: 'التخصص العام',
          description: 'التخصص العام في الهندسة المعلوماتية يغطي المفاهيم الأساسية في مختلف جوانب علوم الحاسوب. يشمل هذا التخصص دراسة أساسيات البرمجة، الخوارزميات، هياكل البيانات، نظم التشغيل، وأساسيات الحوسبة.',
          icon,
          banner,
          topics: [
            {
              id: 'gen1',
              title: 'أساسيات البرمجة',
              description: 'مفاهيم البرمجة الأساسية، لغات البرمجة، أنماط البرمجة.'
            },
            {
              id: 'gen2',
              title: 'الخوارزميات وهياكل البيانات',
              description: 'تحليل الخوارزميات، هياكل البيانات الأساسية، تقنيات حل المشكلات.'
            },
            {
              id: 'gen3',
              title: 'نظم التشغيل',
              description: 'مكونات نظم التشغيل، إدارة العمليات، إدارة الذاكرة، نظم الملفات.'
            },
            {
              id: 'gen4',
              title: 'أساسيات الحوسبة',
              description: 'تنظيم الحاسوب، المعمارية، أنظمة العد، المنطق الرقمي.'
            },
            {
              id: 'gen5',
              title: 'أمن المعلومات',
              description: 'مبادئ أمن المعلومات، التشفير، أمن البرمجيات، أخلاقيات الحوسبة.'
            }
          ],
          resources: [
            {
              id: 'gres1',
              title: 'هياكل البيانات والخوارزميات',
              type: 'link',
              url: '#'
            },
            {
              id: 'gres2',
              title: 'مرجع نظم التشغيل',
              type: 'file',
              url: '#'
            },
            {
              id: 'gres3',
              title: 'فيديو: أساسيات أمن المعلومات',
              type: 'video',
              url: '#'
            }
          ]
        }
      };
      
      // التحقق من وجود التخصص
      if (id && id in specializations) {
        setSpecializationData(specializations[id]);
      } else {
        // إعادة التوجيه إلى صفحة غير موجودة أو رسالة خطأ
        console.error('التخصص غير موجود');
      }
      
      setIsLoading(false);
    };
    
    fetchSpecializationData();
  }, [id]);
  
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">يرجى تسجيل الدخول</h1>
          <p className="mt-4 text-lg text-gray-600">
            يجب عليك تسجيل الدخول للوصول إلى صفحة التخصصات.
          </p>
          <div className="mt-8">
            <Link to="/login" className="btn btn-primary">
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loader" />
      </div>
    );
  }
  
  if (!specializationData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">التخصص غير موجود</h1>
          <p className="mt-4 text-lg text-gray-600">
            عذراً، لم يتم العثور على التخصص المطلوب.
          </p>
          <div className="mt-8">
            <Link to="/" className="btn btn-primary">
              العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // الحصول على رمز ولون التخصص
  const getSpecializationColorClass = () => {
    switch (id) {
      case 'software':
        return 'bg-blue-500';
      case 'networks':
        return 'bg-green-500';
      case 'ai':
        return 'bg-purple-500';
      case 'general':
        return 'bg-gray-500';
      default:
        return 'bg-primary-500';
    }
  };
  
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
        return <Book className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* رأس الصفحة */}
      <div 
        className="bg-gray-800 bg-cover bg-center" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url(${specializationData.banner})` 
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center">
            <div className={`h-16 w-16 rounded-full flex items-center justify-center ${
              id === 'software' ? 'bg-blue-100 text-blue-600' :
              id === 'networks' ? 'bg-green-100 text-green-600' :
              id === 'ai' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
            }`}>
              {specializationData.icon}
            </div>
            <h1 className="mr-4 text-3xl font-bold text-white">{specializationData.title}</h1>
          </div>
          <p className="mt-4 max-w-3xl text-lg text-gray-300">
            {specializationData.description}
          </p>
        </div>
      </div>
      
      {/* علامات التبويب */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex -mb-px">
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
              onClick={() => setActiveTab('topics')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'topics'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              المواضيع
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'resources'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              المصادر
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
          </nav>
        </div>
      </div>
      
      {/* المحتوى */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* نظرة عامة */}
        {activeTab === 'overview' && (
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                حول {specializationData.title}
              </h2>
              <p className="text-gray-600 mb-4">
                {specializationData.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">المهارات المطلوبة</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>الفهم العميق للمفاهيم النظرية في {specializationData.title}</li>
                    <li>القدرة على تطبيق المعرفة في حل المشكلات</li>
                    <li>مهارات التحليل والتفكير المنطقي</li>
                    <li>الإلمام بأحدث التقنيات في المجال</li>
                  </ul>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">طرق التحضير</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>مراجعة المواضيع الرئيسية بانتظام</li>
                    <li>حل أسئلة وتمارين من سنوات سابقة</li>
                    <li>المشاركة في امتحانات تجريبية</li>
                    <li>الاطلاع على المصادر التعليمية المتاحة</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    id === 'software' ? 'bg-blue-100 text-blue-600' :
                    id === 'networks' ? 'bg-green-100 text-green-600' :
                    id === 'ai' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Book className="h-5 w-5" />
                  </div>
                  <h3 className="mr-3 text-lg font-medium text-gray-900">
                    {specializationData.topics.length} موضوع
                  </h3>
                </div>
                <p className="text-gray-600">
                  اكتشف المواضيع الرئيسية في هذا التخصص والتي تغطي كافة جوانب الامتحان.
                </p>
                <button
                  onClick={() => setActiveTab('topics')}
                  className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                >
                  مشاهدة المواضيع &larr;
                </button>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    id === 'software' ? 'bg-blue-100 text-blue-600' :
                    id === 'networks' ? 'bg-green-100 text-green-600' :
                    id === 'ai' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <FileText className="h-5 w-5" />
                  </div>
                  <h3 className="mr-3 text-lg font-medium text-gray-900">
                    {specializationData.resources.length} مصدر تعليمي
                  </h3>
                </div>
                <p className="text-gray-600">
                  استكشف الملفات والمراجع والفيديوهات التعليمية المتاحة لهذا التخصص.
                </p>
                <button
                  onClick={() => setActiveTab('resources')}
                  className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                >
                  مشاهدة المصادر &larr;
                </button>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    id === 'software' ? 'bg-blue-100 text-blue-600' :
                    id === 'networks' ? 'bg-green-100 text-green-600' :
                    id === 'ai' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <h3 className="mr-3 text-lg font-medium text-gray-900">
                    امتحانات تجريبية
                  </h3>
                </div>
                <p className="text-gray-600">
                  اختبر معلوماتك من خلال امتحانات تجريبية تحاكي الامتحان الحقيقي.
                </p>
                <button
                  onClick={() => setActiveTab('exams')}
                  className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                >
                  بدء امتحان &larr;
                </button>
              </div>
            </div>
            
            <div className="bg-primary-50 border-r-4 border-primary-500 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-2">نصائح للنجاح</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>خصص وقتاً كافياً لدراسة كل موضوع من مواضيع التخصص</li>
                <li>ركز على فهم المفاهيم الأساسية وليس فقط حفظها</li>
                <li>حل أكبر عدد ممكن من الأسئلة والامتحانات التجريبية</li>
                <li>اطلع على أحدث التطورات في المجال من خلال المصادر المتاحة</li>
                <li>تواصل مع زملائك لمناقشة المواضيع الصعبة وتبادل المعرفة</li>
              </ul>
            </div>
          </div>
        )}
        
        {/* المواضيع */}
        {activeTab === 'topics' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              المواضيع الرئيسية في {specializationData.title}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {specializationData.topics.map((topic, index) => (
                <div key={topic.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className={`h-2 ${getSpecializationColorClass()}`}></div>
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                        <span className="text-sm font-medium">{index + 1}</span>
                      </div>
                      <h3 className="mr-3 text-lg font-medium text-gray-900">{topic.title}</h3>
                    </div>
                    <p className="text-gray-600">{topic.description}</p>
                    <div className="mt-4 flex justify-end">
                      <a
                        href="#"
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        تعلم المزيد &larr;
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* المصادر */}
        {activeTab === 'resources' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              المصادر التعليمية لتخصص {specializationData.title}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {specializationData.resources.map((resource) => (
                <div key={resource.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      {getResourceTypeIcon(resource.type)}
                      <h3 className="mr-2 text-lg font-medium text-gray-900">{resource.title}</h3>
                    </div>
                    <div className="mt-4">
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full btn btn-outline flex justify-center items-center"
                      >
                        {resource.type === 'file' ? (
                          <>
                            <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            تحميل الملف
                          </>
                        ) : resource.type === 'video' ? (
                          <>
                            <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            مشاهدة الفيديو
                          </>
                        ) : (
                          <>
                            <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            فتح الرابط
                          </>
                        )}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">مصادر إضافية</h3>
              <p className="text-gray-600 mb-4">
                بالإضافة إلى المصادر المتاحة أعلاه، يمكنك الاطلاع على المزيد من المصادر التعليمية في صفحة المصادر العامة.
              </p>
              <Link
                to="/resources"
                className="btn btn-primary"
              >
                زيارة صفحة المصادر
              </Link>
            </div>
          </div>
        )}
        
        {/* الامتحانات */}
        {activeTab === 'exams' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              الامتحانات التجريبية لتخصص {specializationData.title}
            </h2>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className={`h-2 ${getSpecializationColorClass()}`}></div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  امتحان {specializationData.title} الشامل
                </h3>
                <p className="text-gray-600 mb-4">
                  امتحان تجريبي شامل يغطي جميع مواضيع {specializationData.title}. يتضمن الامتحان أسئلة متنوعة تحاكي أسئلة الامتحان الحقيقي.
                </p>
                <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4">
                  <span className="inline-flex items-center ml-4 mb-1">
                    <FileText className="h-4 w-4 ml-1" />
                    20 سؤال
                  </span>
                  <span className="inline-flex items-center ml-4 mb-1">
                    <svg className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    30 دقيقة
                  </span>
                  <span className="inline-flex items-center mb-1">
                    <svg className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    مستوى الصعوبة: متوسط
                  </span>
                </div>
                <Link
                  to={`/exams/start?specialization=${id}`}
                  className="w-full btn btn-primary flex justify-center items-center"
                >
                  <CheckCircle className="h-5 w-5 ml-1" />
                  بدء الامتحان
                </Link>
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className={`h-2 ${getSpecializationColorClass()}`}></div>
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    اختبار سريع - المفاهيم الأساسية
                  </h3>
                  <p className="text-gray-600 mb-4">
                    اختبار قصير يغطي المفاهيم الأساسية في {specializationData.title}.
                  </p>
                  <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4">
                    <span className="inline-flex items-center ml-4 mb-1">
                      <FileText className="h-4 w-4 ml-1" />
                      10 أسئلة
                    </span>
                    <span className="inline-flex items-center mb-1">
                      <svg className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      15 دقيقة
                    </span>
                  </div>
                  <Link
                    to={`/quiz/basics-${id}`}
                    className="w-full btn btn-outline flex justify-center items-center"
                  >
                    بدء الاختبار
                  </Link>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className={`h-2 ${getSpecializationColorClass()}`}></div>
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    اختبار سريع - المفاهيم المتقدمة
                  </h3>
                  <p className="text-gray-600 mb-4">
                    اختبار قصير يغطي المفاهيم المتقدمة في {specializationData.title}.
                  </p>
                  <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4">
                    <span className="inline-flex items-center ml-4 mb-1">
                      <FileText className="h-4 w-4 ml-1" />
                      10 أسئلة
                    </span>
                    <span className="inline-flex items-center mb-1">
                      <svg className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      15 دقيقة
                    </span>
                  </div>
                  <Link
                    to={`/quiz/advanced-${id}`}
                    className="w-full btn btn-outline flex justify-center items-center"
                  >
                    بدء الاختبار
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Specialization;
 