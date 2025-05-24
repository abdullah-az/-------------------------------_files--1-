import  { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash, Search, 
  Filter, User, Mail, 
  Check, X 
} from 'lucide-react';

// مصفوفة تجريبية للمستخدمين المشرفين
const mockAdmins = [
  {
    id: 'a1',
    name: 'مشرف النظام',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2023-01-15'
  },
  {
    id: 'a2',
    name: 'سارة أحمد',
    email: 'sarah@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2023-02-20'
  },
  {
    id: 'a3',
    name: 'محمد علي',
    email: 'mohamed@example.com',
    role: 'admin',
    status: 'inactive',
    createdAt: '2023-03-10'
  }
];

const AdminManager = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // مودال إضافة/تعديل مشرف
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    status: 'active'
  });
  
  useEffect(() => {
    // محاكاة استرجاع البيانات من API
    const fetchAdmins = async () => {
      setIsLoading(true);
      
      // تأخير لمحاكاة طلب الشبكة
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAdmins(mockAdmins);
      setIsLoading(false);
    };
    
    fetchAdmins();
  }, []);
  
  // تصفية المشرفين بناءً على مصطلح البحث والفلاتر
  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = searchTerm === '' || 
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === '' || admin.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  // فتح مودال إضافة مشرف جديد
  const handleAddAdmin = () => {
    setSelectedAdmin(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      status: 'active'
    });
    setIsAddModalOpen(true);
  };
  
  // فتح مودال تعديل مشرف
  const handleEditAdmin = (admin: any) => {
    setSelectedAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      password: '',
      status: admin.status
    });
    setIsAddModalOpen(true);
  };
  
  // تغيير حالة المشرف (نشط/غير نشط)
  const toggleAdminStatus = (admin: any) => {
    // في بيئة حقيقية، هنا سيتم استدعاء API لتغيير الحالة
    const updatedAdmins = admins.map(a => {
      if (a.id === admin.id) {
        return { ...a, status: a.status === 'active' ? 'inactive' : 'active' };
      }
      return a;
    });
    
    setAdmins(updatedAdmins);
  };
  
  // حفظ بيانات المشرف (إضافة/تعديل)
  const handleSaveAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedAdmin) {
      // تحديث بيانات مشرف موجود
      const updatedAdmins = admins.map(admin => {
        if (admin.id === selectedAdmin.id) {
          return {
            ...admin,
            name: formData.name,
            email: formData.email,
            status: formData.status
          };
        }
        return admin;
      });
      
      setAdmins(updatedAdmins);
    } else {
      // إضافة مشرف جديد
      const newAdmin = {
        id: `a${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: 'admin',
        status: formData.status,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setAdmins([...admins, newAdmin]);
    }
    
    setIsAddModalOpen(false);
  };
  
  // حذف مشرف
  const handleDeleteAdmin = () => {
    if (selectedAdmin) {
      // في بيئة حقيقية، هنا سيتم استدعاء API لحذف المشرف
      setAdmins(admins.filter(admin => admin.id !== selectedAdmin.id));
      setShowDeleteModal(false);
    }
  };
  
  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المشرفين</h1>
          <p className="mt-1 text-sm text-gray-500">إضافة وتعديل وحذف حسابات المشرفين.</p>
        </div>
        <button
          onClick={handleAddAdmin}
          className="mt-4 sm:mt-0 btn btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 ml-1" />
          إضافة مشرف جديد
        </button>
      </div>
      
      {/* فلاتر البحث */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              بحث عن مشرف
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="أدخل الاسم أو البريد الإلكتروني..."
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              الحالة
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* قائمة المشرفين */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <span className="loader" />
        </div>
      ) : filteredAdmins.length > 0 ? (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المشرف
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    البريد الإلكتروني
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاريخ الإنشاء
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 flex items-center">
                        <Mail className="h-4 w-4 ml-1" />
                        {admin.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        admin.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {admin.status === 'active' ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(admin.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2 space-x-reverse">
                        <button
                          onClick={() => toggleAdminStatus(admin)}
                          className={`p-1 ${
                            admin.status === 'active' ? 'text-red-600 hover:bg-red-100' : 'text-green-600 hover:bg-green-100'
                          } rounded-full`}
                          title={admin.status === 'active' ? 'تعطيل' : 'تنشيط'}
                        >
                          {admin.status === 'active' ? <X className="h-5 w-5" /> : <Check className="h-5 w-5" />}
                        </button>
                        <button
                          onClick={() => handleEditAdmin(admin)}
                          className="p-1 text-indigo-600 hover:bg-indigo-100 rounded-full"
                          title="تعديل"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedAdmin(admin);
                            setShowDeleteModal(true);
                          }}
                          className="p-1 text-red-600 hover:bg-red-100 rounded-full"
                          title="حذف"
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">لم يتم العثور على مشرفين مطابقين لمعايير البحث.</p>
        </div>
      )}
      
      {/* مودال إضافة/تعديل مشرف */}
      {isAddModalOpen && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="relative bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {selectedAdmin ? 'تعديل بيانات المشرف' : 'إضافة مشرف جديد'}
            </h2>
            
            <form onSubmit={handleSaveAdmin}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    الاسم
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                {!selectedAdmin && (
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      كلمة المرور
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required={!selectedAdmin}
                      className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                )}
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    الحالة
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3 space-x-reverse">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn btn-outline"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {selectedAdmin ? 'حفظ التغييرات' : 'إضافة مشرف'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* مودال حذف المشرف */}
      {showDeleteModal && selectedAdmin && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowDeleteModal(false)}></div>
          <div className="relative bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">تأكيد الحذف</h2>
            <p className="text-gray-700 mb-6">
              هل أنت متأكد من رغبتك في حذف حساب المشرف <span className="font-semibold">{selectedAdmin.name}</span>؟ هذا الإجراء لا يمكن التراجع عنه.
            </p>
            <div className="flex justify-end space-x-3 space-x-reverse">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-outline"
              >
                إلغاء
              </button>
              <button
                onClick={handleDeleteAdmin}
                className="btn bg-red-600 text-white hover:bg-red-700"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManager;
 