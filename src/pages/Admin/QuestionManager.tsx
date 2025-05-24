import  { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Edit, Trash, Image, File, Check,
  Database, Book, Server, Globe, AlertCircle, X, Users, Code
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AttachmentUploader from '../../components/AttachmentUploader';

// Question type definition
interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  specialization: string;
  year: string;
  marks: number;
  attachment?: {
    type: 'image' | 'code' | 'text' | 'diagram';
    content: string;
  };
}

// Initial questions data
const initialQuestions: Question[] = [
  {
    id: 'q1',
    text: 'أي من التالي ليس من هياكل البيانات الخطية؟',
    options: [
      'المصفوفة (Array)',
      'القائمة المتصلة (Linked List)',
      'الشجرة (Tree)',
      'المكدس (Stack)'
    ],
    correctAnswer: 2,
    specialization: 'software',
    year: '2023',
    marks: 2
  },
  {
    id: 'q2',
    text: 'ما هو البروتوكول المسؤول عن ترجمة أسماء النطاقات إلى عناوين IP؟',
    options: [
      'DHCP',
      'DNS',
      'FTP',
      'SMTP'
    ],
    correctAnswer: 1,
    specialization: 'networks',
    year: '2023',
    marks: 2,
    attachment: {
      type: 'diagram',
      content: 'https://images.unsplash.com/photo-1501300140941-6c556d26c1b9?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxhZG1pbiUyMGRhc2hib2FyZCUyMHVpJTIwcGFuZWwlMjBpbnRlcmZhY2V8ZW58MHx8fHwxNzQ2NDI3ODY3fDA'
    }
  },
  {
    id: 'q3',
    text: 'ما هي الخوارزمية المستخدمة في التعلم العميق؟',
    options: [
      'خوارزمية التصنيف البسيطة',
      'خوارزمية K-Means',
      'الشبكات العصبونية',
      'خوارزمية Apriori'
    ],
    correctAnswer: 2,
    specialization: 'ai',
    year: '2023',
    marks: 3,
    attachment: {
      type: 'image',
      content: 'https://images.unsplash.com/photo-1495420233471-7ff3f397d22f?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw1fHxlZHVjYXRpb25hbCUyMHBsYXRmb3JtJTIwYXJhYmljJTIwdXNlciUyMGludGVyZmFjZSUyMGV4YW0lMjBkYXNoYm9hcmR8ZW58MHx8fHwxNzQ2NDI4NjIwfDA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800'
    }
  },
];

// Specialization data
const specializations = [
  { id: 'software', title: 'هندسة البرمجيات', icon: <Code className="h-5 w-5" /> },
  { id: 'networks', title: 'هندسة الشبكات', icon: <Server className="h-5 w-5" /> },
  { id: 'ai', title: 'الذكاء الاصطناعي', icon: <Database className="h-5 w-5" /> },
  { id: 'general', title: 'التخصص العام', icon: <Globe className="h-5 w-5" /> }
];

// Year options
const yearOptions = ['2023', '2022', '2021', '2020', '2019'];

const QuestionManager = () => {
  // State management
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>(initialQuestions);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('');
  const [filterYear, setFilterYear] = useState('');
  
  // Form state
  const [formData, setFormData] = useState<Omit<Question, 'id'>>({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    specialization: 'software',
    year: '2023',
    marks: 1
  });
  
  // For file attachment
  const [attachment, setAttachment] = useState<{
    file: File | null;
    type: 'image' | 'code' | 'text' | 'diagram';
    preview: string | null;
  }>({
    file: null,
    type: 'image',
    preview: null
  });

  // Filter questions based on search and filters
  useEffect(() => {
    let filtered = questions;
    
    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.text.includes(searchTerm) || 
        q.options.some(option => option.includes(searchTerm))
      );
    }
    
    if (filterSpecialization) {
      filtered = filtered.filter(q => q.specialization === filterSpecialization);
    }
    
    if (filterYear) {
      filtered = filtered.filter(q => q.year === filterYear);
    }
    
    setFilteredQuestions(filtered);
  }, [questions, searchTerm, filterSpecialization, filterYear]);

  // Handle opening new question modal
  const handleNewQuestion = () => {
    setSelectedQuestion(null);
    setFormData({
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      specialization: 'software',
      year: '2023',
      marks: 1
    });
    setAttachment({
      file: null,
      type: 'image',
      preview: null
    });
    setIsModalOpen(true);
  };

  // Handle opening edit question modal
  const handleEditQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setFormData({
      text: question.text,
      options: [...question.options],
      correctAnswer: question.correctAnswer,
      specialization: question.specialization,
      year: question.year,
      marks: question.marks,
      attachment: question.attachment
    });
    if (question.attachment) {
      setAttachment({
        file: null,
        type: question.attachment.type,
        preview: question.attachment.content
      });
    } else {
      setAttachment({
        file: null,
        type: 'image',
        preview: null
      });
    }
    setIsModalOpen(true);
  };

  // Handle opening delete confirmation modal
  const handleDeleteClick = (question: Question) => {
    setSelectedQuestion(question);
    setIsDeleteModalOpen(true);
  };

  // Handle actual deletion
  const handleDeleteConfirm = () => {
    if (selectedQuestion) {
      const updatedQuestions = questions.filter(q => q.id !== selectedQuestion.id);
      setQuestions(updatedQuestions);
      setIsDeleteModalOpen(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle option changes
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  // Handle correct answer selection
  const handleCorrectAnswerChange = (index: number) => {
    setFormData(prev => ({
      ...prev,
      correctAnswer: index
    }));
  };

  // Handle attachment change from component
  const handleAttachmentChange = (newAttachment: {
    file: File | null;
    type: 'image' | 'code' | 'text' | 'diagram';
    preview: string | null;
  }) => {
    setAttachment(newAttachment);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const attachmentData = attachment.preview ? {
      type: attachment.type,
      content: attachment.preview
    } : undefined;
    
    if (selectedQuestion) {
      // Update existing question
      const updatedQuestions = questions.map(q => 
        q.id === selectedQuestion.id 
          ? { 
              ...selectedQuestion, 
              ...formData, 
              attachment: attachmentData 
            }
          : q
      );
      setQuestions(updatedQuestions);
    } else {
      // Add new question
      const newQuestion: Question = {
        id: `q${questions.length + 1}`,
        ...formData,
        attachment: attachmentData
      };
      setQuestions([...questions, newQuestion]);
    }
    
    setIsModalOpen(false);
  };

  // Get specialization name by ID
  const getSpecializationName = (id: string) => {
    const spec = specializations.find(s => s.id === id);
    return spec ? spec.title : id;
  };

  // Get specialization icon by ID
  const getSpecializationIcon = (id: string) => {
    const spec = specializations.find(s => s.id === id);
    return spec ? spec.icon : <Book className="h-5 w-5" />;
  };

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">لوحة الإدارة</h1>
            <p className="text-gray-600 mt-1">إدارة الأسئلة والمستخدمين للامتحان الموحد في الهندسة المعلوماتية</p>
          </div>
          <div className="flex space-x-3 space-x-reverse">
            <Link
              to="/users"
              className="btn btn-outline flex items-center"
            >
              <Users className="ml-1 h-5 w-5" />
              إدارة المستخدمين
            </Link>
            <button
              onClick={handleNewQuestion}
              className="btn btn-primary flex items-center"
            >
              <Plus className="ml-1 h-5 w-5" />
              إضافة سؤال جديد
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="ابحث في الأسئلة..."
                className="block w-full px-4 py-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative w-full md:w-auto">
                <select
                  className="block w-full px-4 py-3 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pr-10"
                  value={filterSpecialization}
                  onChange={(e) => setFilterSpecialization(e.target.value)}
                >
                  <option value="">جميع التخصصات</option>
                  {specializations.map(spec => (
                    <option key={spec.id} value={spec.id}>{spec.title}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div className="relative w-full md:w-auto">
                <select
                  className="block w-full px-4 py-3 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pr-10"
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                >
                  <option value="">جميع السنوات</option>
                  {yearOptions.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                    #
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    نص السؤال
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التخصص
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    السنة
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    العلامة
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    مرفق
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredQuestions.map((question, index) => (
                  <tr key={question.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="line-clamp-2">{question.text}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center">
                        {getSpecializationIcon(question.specialization)}
                        <span className="mr-2">{getSpecializationName(question.specialization)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {question.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {question.marks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {question.attachment ? (
                        <div className="flex items-center text-primary-600">
                          {question.attachment.type === 'image' && <Image className="h-5 w-5" />}
                          {question.attachment.type === 'code' && <Code className="h-5 w-5" />}
                          {question.attachment.type === 'text' && <File className="h-5 w-5" />}
                          {question.attachment.type === 'diagram' && <Image className="h-5 w-5" />}
                          <span className="mr-1">نعم</span>
                        </div>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex space-x-2 space-x-reverse">
                        <button
                          onClick={() => handleEditQuestion(question)}
                          className="text-primary-600 hover:text-primary-800"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(question)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredQuestions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                      لم يتم العثور على أسئلة مطابقة للبحث. قم بتعديل معايير البحث أو إضافة أسئلة جديدة.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedQuestion ? 'تعديل السؤال' : 'إضافة سؤال جديد'}
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Question Text */}
                  <div>
                    <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
                      نص السؤال
                    </label>
                    <textarea
                      id="text"
                      name="text"
                      rows={3}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      value={formData.text}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  {/* Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      الخيارات
                    </label>
                    <div className="space-y-3">
                      {formData.options.map((option, index) => (
                        <div key={index} className="flex items-center">
                          <button
                            type="button"
                            onClick={() => handleCorrectAnswerChange(index)}
                            className={`ml-3 h-6 w-6 rounded-full flex items-center justify-center ${
                              formData.correctAnswer === index
                                ? 'bg-primary-600 text-white'
                                : 'bg-white border border-gray-300'
                            }`}
                          >
                            {formData.correctAnswer === index && (
                              <Check className="h-4 w-4" />
                            )}
                          </button>
                          <input
                            type="text"
                            required
                            placeholder={`الخيار ${index + 1}`}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Metadata */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                        التخصص
                      </label>
                      <select
                        id="specialization"
                        name="specialization"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        value={formData.specialization}
                        onChange={handleInputChange}
                      >
                        {specializations.map(spec => (
                          <option key={spec.id} value={spec.id}>{spec.title}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                        سنة الدورة
                      </label>
                      <select
                        id="year"
                        name="year"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        value={formData.year}
                        onChange={handleInputChange}
                      >
                        {yearOptions.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="marks" className="block text-sm font-medium text-gray-700 mb-1">
                        العلامة
                      </label>
                      <input
                        type="number"
                        id="marks"
                        name="marks"
                        min="1"
                        max="10"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        value={formData.marks}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  {/* Attachment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      المرفق
                    </label>
                    
                    <AttachmentUploader 
                      onAttachmentChange={handleAttachmentChange}
                      initialAttachment={selectedQuestion?.attachment}
                    />
                  </div>
                  
                  {/* Form Actions */}
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="btn btn-outline"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      {selectedQuestion ? 'حفظ التغييرات' : 'إضافة السؤال'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center mb-4 text-red-600">
                <AlertCircle className="h-6 w-6 ml-2" />
                <h3 className="text-lg font-medium">تأكيد الحذف</h3>
              </div>
              
              <p className="mb-4 text-gray-700">
                هل أنت متأكد من رغبتك في حذف هذا السؤال؟ لا يمكن التراجع عن هذا الإجراء.
              </p>
              
              <div className="bg-gray-50 p-3 rounded-md mb-4">
                <p className="text-gray-800 font-medium line-clamp-2">{selectedQuestion.text}</p>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="btn btn-outline"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="btn bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                >
                  تأكيد الحذف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionManager;
 