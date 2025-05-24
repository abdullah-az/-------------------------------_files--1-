import  { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash, Search, 
  Filter, User, Mail, 
  Book, BookOpen, Check, X 
} from 'lucide-react';

const mockUsers = [
  {
    id: 'u1',
    name: 'أحمد محمد',
    email: 'ahmad@example.com',
    role: 'student',
    university: 'جامعة دمشق',
    specialty: 'هندسة معلوماتية',
    status: 'active',
    createdAt: '2023-05-15'
  },
  {
    id: 'u2',
    name: 'سارة خالد',
    email: 'sara@example.com',
    role: 'student',
    university: 'جامعة حلب',
    specialty: 'هندسة معلوماتية',
    status: 'active',
    createdAt: '2023-05-20'
  },
  {
    id: 'u3',
    name: 'محمد علي',
    email: 'mohamad@example.com',
    role: 'student',
    university: 'جامعة دمشق',
    specialty: 'هندسة معلوماتية',
    status: 'inactive',
    createdAt: '2023-06-01'
  },
  {
    id: 'u4',
    name: 'فاطمة أحمد',
    email: 'fatima@example.com',
    role: 'student',
    university: 'جامعة تشرين',
    specialty: 'هندسة معلوماتية',
    status: 'active',
    createdAt: '2023-06-10'
  }
];

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // مودال إضافة/تعديل المستخدم
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    university: '',
    specialty: '',
    status: 'active'
  });
  
  useEffect(() => {
    // محاكاة استرجاع البيانات من API
    const fetchUsers = async () => {
      setIsLoading(true);
      
      // تأخير لمحاكاة طلب الشبكة
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(mockUsers);
      setIsLoading(false);
    };
    
    fetchUsers();
  }, []);
  
  // تصفية المستخدمين بناءً على مصطلح البحث والفلاتر
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === '' || user.role === filterRole;
    const matchesStatus = filterStatus === '' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  // فتح مودال إضافة مستخدم جديد
  const handleAddUser = () => {
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'student',
      university: '',
      specialty: '',
      status: 'active'
    });
    setIsAddModalOpen(true);
  };
  
  // فتح مودال تعديل مستخدم
  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      university: user.university || '',
      specialty: user.specialty || '',
      status: user.status
    });
    setIsAddModalOpen(true);
  };
  
  // فتح مودال عرض تفاصيل المستخدم
  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };
  
  // تغيير حالة المستخدم (نشط/غير نشط)
  const toggleUserStatus = (user: any) => {
    // في بيئة حقيقية، هنا سيتم استدعاء API لتغيير الحالة
    const updatedUsers = users.map(u => {
      if (u.id === user.id) {
        return { ...u, status: u.status === 'active' ? 'inactive' : 'active' };
      }
      return u;
    });
    
    setUsers(updatedUsers);
  };
  
  // حفظ بيانات المستخدم (إضافة/تعديل)
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedUser) {
      // تحديث بيانات مستخدم موجود
      const updatedUsers = users.map(user => {
        if (user.id === selectedUser.id) {
          return {
            ...user,
            name: formData.name,
            email: formData.email,
            role: formData.role,
            university: formData.university,
            specialty: formData.specialty,
            status: formData.status
          };
        }
        return user;
      });
      
      setUsers(updatedUsers);
    } else {
      // إضافة مستخدم جديد
      const newUser = {
        id: `u${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        university: formData.university,
        specialty: formData.specialty,
        status: formData.status,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setUsers([...users, newUser]);
    }
    
    setIsAddModalOpen(false);
  };
  
  // حذف مستخدم
  const handleDeleteUser = () => {
    if (selectedUser) {
      // في بيئة حقيقية، هنا سيتم استدعاء API لحذف المستخدم
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setIsDeleteModalOpen(false);
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
          <h1 className="text-2xl font-bold text-gray-900">إدارة المستخدمين</h1>
          <p className="mt-1 text-sm text-gray-500">إضافة وتعديل وحذف حسابات المستخدمين.</p>
        </div>
        <button
          onClick={handleAddUser}
          className="mt-4 sm:mt-0 btn btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 ml-1" />
          إضافة مستخدم جديد
        </button>
      </div>
      
      {/* فلاتر البحث */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              بحث عن مستخدم
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
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              الدور
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="role"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="block w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">جميع الأدوار</option>
                <option value="student">طالب</option>
                <option value="admin">مشرف</option>
              </select>
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
      
      {/* قائمة المستخدمين */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <span className="loader" />
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المستخدم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الدور
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الجامعة
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
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-4 w-4 ml-1" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'admin' ? 'مشرف' : 'طالب'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {user.university || 'غير محدد'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status === 'active' ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2 space-x-reverse">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded-full"
                          title="عرض"
                        >
                          <Book className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => toggleUserStatus(user)}
                          className={`p-1 ${
                            user.status === 'active' ? 'text-red-600 hover:bg-red-100' : 'text-green-600 hover:bg-green-100'
                          } rounded-full`}
                          title={user.status === 'active' ? 'تعطيل' : 'تنشيط'}
                        >
                          {user.status === 'active' ? <X className="h-5 w-5" /> : <Check className="h-5 w-5" />}
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-1 text-indigo-600 hover:bg-indigo-100 rounded-full"
                          title="تعديل"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedUser(user);
                            setIsDeleteModalOpen(true);
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
          <p className="text-gray-500">لم يتم العثور على مستخدمين مطابقين لمعايير البحث.</p>
        </div>
      )}
      
      {/* مودال عرض تفاصيل المستخدم */}
      {isViewModalOpen && selectedUser && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsViewModalOpen(false)}></div>
          <div className="relative bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mx-auto">
                  <User className="h-10 w-10" />
                </div>
                <h2 className="mt-4 text-xl font-bold text-gray-900">
                  {selectedUser.name}
                </h2>
                <p className="text-gray-500">{selectedUser.email}</p>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedUser.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedUser.role === 'admin' ? 'مشرف' : 'طالب'}
                  </span>
                  <span className={`mr-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedUser.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedUser.status === 'active' ? 'نشط' : 'غير نشط'}
                  </span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">تاريخ الإنشاء</div>
                    <div className="mt-1 text-sm text-gray-900">{formatDate(selectedUser.createdAt)}</div>
                  </div>
                  
                  {selectedUser.role === 'student' && (
                    <>
                      <div>
                        <div className="text-sm font-medium text-gray-500">الجامعة</div>
                        <div className="mt-1 text-sm text-gray-900">{selectedUser.university || 'غير محدد'}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-gray-500">التخصص</div>
                        <div className="mt-1 text-sm text-gray-900">{selectedUser.specialty || 'غير محدد'}</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 space-x-reverse mt-6">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="btn btn-outline"
                >
                  إغلاق
                </button>
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    handleEditUser(selectedUser);
                  }}
                  className="btn btn-primary"
                >
                  تعديل
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* مودال إضافة/تعديل المستخدم */}
      {isAddModalOpen && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="relative bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {selectedUser ? 'تعديل بيانات المستخدم' : 'إضافة مستخدم جديد'}
            </h2>
            
            <form onSubmit={handleSaveUser}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    الاسم
                  </label>
                  <input
                    I've analyzed your project structure and can see it's a comprehensive educational platform for unified engineering exams with React frontend and Django backend. The issues reported were mainly related to router errors, component syntax issues, and failed file reloads.

I've fixed these issues and updated the necessary files to make sure your app works correctly. Let's continue with developing the platform with the provided images.

<doodleArtifact id="educational-platform-unified-exam" title="Educational Platform for IT Engineering Unified Exam">
<doodleAction type="file" filePath="package.json">
{
  "name": "educational-platform",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.4.0",
    "lucide-react": "^0.244.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.14.0"
  },
  "devDependencies": {
    "@eslint/js": "^8.41.0",
    "@types/react": "^18.0.37",
    "@types/react-dom": "^18.0.11",
    "@typescript-eslint/eslint-plugin": "^5.59.0",
    "@typescript-eslint/parser": "^5.59.0",
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.4.14",
    "eslint": "^8.38.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.3.4",
    "globals": "^13.20.0",
    "postcss": "^8.4.24",
    "tailwindcss": "^3.3.2",
    "typescript": "^5.0.2",
    "typescript-eslint": "^0.0.1-alpha.0",
    "vite": "^4.3.9"
  }
}
 