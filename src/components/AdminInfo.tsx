import  { useEffect, useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface AdminCredentials {
  email: string;
  password: string;
}

const AdminInfo = () => {
  const [credentials, setCredentials] = useState<AdminCredentials>({
    email: 'admin@example.com',
    password: 'admin123'
  });
  
  const [copied, setCopied] = useState<'email' | 'password' | null>(null);
  
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(null);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [copied]);
  
  const handleCopy = (field: 'email' | 'password') => {
    navigator.clipboard.writeText(credentials[field]);
    setCopied(field);
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">حساب المشرف التجريبي</h2>
      <p className="text-gray-600 mb-4">
        يمكنك استخدام بيانات الاعتماد التالية للوصول إلى لوحة تحكم المشرف:
      </p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
          <div className="flex">
            <input
              type="text"
              readOnly
              value={credentials.email}
              className="form-input rounded-r-none flex-grow"
            />
            <button
              onClick={() => handleCopy('email')}
              className="flex items-center justify-center px-3 py-2 border border-gray-300 border-r-0 rounded-l-md bg-gray-50 text-gray-700 hover:bg-gray-100"
              title="نسخ البريد الإلكتروني"
            >
              {copied === 'email' ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
          <div className="flex">
            <input
              type="text"
              readOnly
              value={credentials.password}
              className="form-input rounded-r-none flex-grow"
            />
            <button
              onClick={() => handleCopy('password')}
              className="flex items-center justify-center px-3 py-2 border border-gray-300 border-r-0 rounded-l-md bg-gray-50 text-gray-700 hover:bg-gray-100"
              title="نسخ كلمة المرور"
            >
              {copied === 'password' ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <p className="text-sm text-gray-500">
          ملاحظة: هذا حساب تجريبي لأغراض العرض فقط. في بيئة الإنتاج الحقيقية، يجب استخدام حسابات مع كلمات مرور قوية وآمنة.
        </p>
      </div>
    </div>
  );
};

export default AdminInfo;
 