import  { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle } from 'lucide-react';

interface ExamResult {
  examId: string;
  examTitle: string;
  date: string;
  correctCount: number;
  totalCount: number;
  percentage: number;
  specialization: string;
}

const ExamHistory = () => {
  const [examHistory, setExamHistory] = useState<ExamResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // في بيئة حقيقية، هنا سيتم استدعاء API للحصول على سجل الامتحانات
    const fetchExamHistory = async () => {
      setIsLoading(true);
      
      // محاكاة تأخير الشبكة
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // بيانات تجريبية
      const mockHistory: ExamResult[] = [
        {
          examId: 'exam1',
          examTitle: 'امتحان هندسة البرمجيات الشامل',
          date: '2023-06-15T14:30:00',
          correctCount: 18,
          totalCount: 20,
          percentage: 90,
          specialization: 'software'
        },
        {
          examId: 'exam2',
          examTitle: 'امتحان هندسة الشبكات الأساسي',
          date: '2023-06-10T10:15:00',
          correctCount: 15,
          totalCount: 20,
          percentage: 75,
          specialization: 'networks'
        },
        {
          examId: 'exam3',
          examTitle: 'امتحان الذكاء الاصطناعي المتقدم',
          date: '2023-06-05T16:45:00',
          correctCount: 16,
          totalCount: 20,
          percentage: 80,
          specialization: 'ai'
        }
      ];
      
      setExamHistory(mockHistory);
      setIsLoading(false);
    };
    
    fetchExamHistory();
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
      <div className="flex justify-center py-4">
        <span className="loader" />
      </div>
    );
  }
  
  if (examHistory.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">لم تكمل أي امتحانات بعد.</p>
        <Link to="/exams/start" className="mt-4 btn btn-primary inline-block">
          ابدأ أول امتحان
        </Link>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الامتحان
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              التاريخ
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              النتيجة
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              التخصص
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الإجراءات
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {examHistory.map((exam) => (
            <tr key={exam.examId}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{exam.examTitle}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 ml-1" />
                    {formatDate(exam.date)}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div 
                    className={`h-2.5 w-2.5 rounded-full ml-2 ${
                      exam.percentage >= 80 ? 'bg-green-500' :
                      exam.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  ></div>
                  <span className="text-sm text-gray-900">
                    {exam.correctCount}/{exam.totalCount} ({exam.percentage}%)
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  exam.specialization === 'software' ? 'bg-blue-100 text-blue-800' :
                  exam.specialization === 'networks' ? 'bg-green-100 text-green-800' :
                  exam.specialization === 'ai' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {exam.specialization === 'software' ? 'هندسة البرمجيات' :
                   exam.specialization === 'networks' ? 'هندسة الشبكات' :
                   exam.specialization === 'ai' ? 'الذكاء الاصطناعي' : 'التخصص العام'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <Link
                  to={`/exams/${exam.examId}/result`}
                  className="text-primary-600 hover:text-primary-900"
                >
                  عرض التفاصيل
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExamHistory;
 