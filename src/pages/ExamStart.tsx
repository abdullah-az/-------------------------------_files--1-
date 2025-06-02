import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import examService from '../api/examService';
import { AIModel } from '../types'; // Import AIModel type
import * as aiService from '../api/aiService'; // Import AI service
import { Book, CheckCircle, Clock, AlertCircle, HelpCircle, Play, Brain, Sparkles } from 'lucide-react';

// Mock Exam interface - replace with actual if different
interface MockExamPreset {
  id: string;
  title: string;
  description: string;
  specialization: 'software' | 'networks' | 'ai' | 'general';
  questionCount: number;
  timeLimit: number; // بالدقائق
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const ExamStart: React.FC = () => {
  const navigate = useNavigate();
  const [mockExamPresets, setMockExamPresets] = useState<MockExamPreset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPresetId, setSelectedPresetId] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<'software' | 'networks' | 'ai' | 'general' | ''>('');
  const [questionCount, setQuestionCount] = useState(20);
  const [examMode, setExamMode] = useState<'random' | 'fixed' | 'ai'>('random');
  const [examType, setExamType] = useState<'normal' | 'ai'>('normal'); // New state for exam type
  const [aiModels, setAiModels] = useState<AIModel[]>([]); // New state for AI models
  const [selectedAiModelId, setSelectedAiModelId] = useState<number | undefined>(undefined); // New state for selected AI model
  const [error, setError] = useState('');
  const [isStartingExam, setIsStartingExam] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Fetch mock exam presets (replace with actual API call if needed)
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        const mockData: MockExamPreset[] = [
          { id: 'exam1', title: 'امتحان هندسة البرمجيات الشامل', description: 'امتحان شامل يغطي كافة موضوعات هندسة البرمجيات.', specialization: 'software', questionCount: 30, timeLimit: 45, difficulty: 'intermediate' },
          { id: 'exam2', title: 'امتحان هندسة الشبكات الأساسي', description: 'امتحان يغطي المفاهيم الأساسية في هندسة الشبكات.', specialization: 'networks', questionCount: 25, timeLimit: 40, difficulty: 'beginner' },
          { id: 'exam3', title: 'امتحان الذكاء الاصطناعي المتقدم', description: 'امتحان متقدم في مفاهيم وتقنيات الذكاء الاصطناعي.', specialization: 'ai', questionCount: 35, timeLimit: 50, difficulty: 'advanced' },
          { id: 'exam4', title: 'امتحان التخصص العام', description: 'امتحان يغطي المفاهيم الأساسية في الهندسة المعلوماتية.', specialization: 'general', questionCount: 40, timeLimit: 60, difficulty: 'intermediate' }
        ];
        setMockExamPresets(mockData);

        // Fetch AI models if AI mode is selected or by default if needed
        const models = await aiService.getAIModels();
        setAiModels(models.filter(model => model.is_active)); // Filter for active models
        if (models.length > 0 && models.filter(model => model.is_active).length > 0) {
          setSelectedAiModelId(models.filter(model => model.is_active)[0].id); // Select first active model by default
        }

      } catch (err) {
        console.error("Failed to fetch initial data:", err);
        setError("Failed to load initial exam data or AI models.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handlePresetSelect = (presetId: string) => {
    setSelectedPresetId(presetId);
    setExamMode('fixed');
    setExamType('normal'); // Fixed exams are normal
    const selectedPreset = mockExamPresets.find(exam => exam.id === presetId);
    if (selectedPreset) {
      setSelectedSpecialization(selectedPreset.specialization);
      setQuestionCount(selectedPreset.questionCount);
    }
  };
  
  const handleStartExam = async () => {
    if (!selectedSpecialization) {
      setError('يرجى اختيار التخصص أولاً');
      return;
    }
    if (examType === 'ai' && !selectedAiModelId) {
      setError('يرجى اختيار نموذج ذكاء اصطناعي');
      return;
    }
    if (questionCount < 5 || questionCount > 50) {
      setError('عدد الأسئلة يجب أن يكون بين 5 و 50');
      return;
    }

    setError('');
    setIsStartingExam(true);

    try {
      const examParams = {
        specialization: selectedSpecialization,
        question_count: questionCount,
        exam_type: examType,
        ai_model_id: examType === 'ai' ? selectedAiModelId : undefined,
      };
      
      // examService.startExam will internally decide the endpoint based on exam_type
      const response = await examService.startExam(examParams);
      
      if (response && response.id) { // Assuming backend returns exam id as 'id'
        navigate(`/exams/${response.id}`);
      } else {
        throw new Error('لم يتم الحصول على معرف الامتحان من الخادم');
      }
    } catch (error: any) {
      console.error('خطأ في بدء الامتحان:', error);
      if (error.response) {
        const message = error.response.data?.message || error.response.data?.error || 'An unknown server error occurred.';
        setError(message);
      } else if (error.request) {
        setError('خطأ في الاتصال بالخادم. تأكد من اتصالك بالإنترنت.');
      } else {
        setError(error.message || 'حدث خطأ غير متوقع');
      }
    } finally {
      setIsStartingExam(false);
    }
  };

  // الحصول على اسم التخصص
  const getSpecializationName = (specialization: string) => {
    switch (specialization) {
      case 'software':
        return 'هندسة البرمجيات';
      case 'networks':
        return 'هندسة الشبكات';
      case 'ai':
        return 'الذكاء الاصطناعي';
      case 'general':
        return 'التخصص العام';
      default:
        return specialization;
    }
  };
  
  // الحصول على اسم مستوى الصعوبة
  const getDifficultyName = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'مبتدئ';
      case 'intermediate':
        return 'متوسط';
      case 'advanced':
        return 'متقدم';
      default:
        return difficulty;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <span className="loader" />
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6">
          <h1 className="text-2xl font-bold text-white">بدء امتحان جديد</h1>
          <p className="mt-2 text-primary-100">
            اختر تخصصًا وعدد الأسئلة لبدء امتحان عشوائي، أو اختر أحد الامتحانات المحددة مسبقًا.
          </p>
        </div>
        
        <div className="p-6">
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => { setExamMode('random'); setExamType('normal'); }}
              className={`flex-1 py-3 rounded-lg border-2 flex items-center justify-center ${
                examMode === 'random'
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <AlertCircle className={`h-5 w-5 ml-2 ${examMode === 'random' ? 'text-primary-600' : 'text-gray-500'}`} />
              <span>امتحان قياسي (عشوائي)</span>
            </button>
            <button
              onClick={() => { setExamMode('fixed'); setExamType('normal'); }}
              className={`flex-1 py-3 rounded-lg border-2 flex items-center justify-center ${
                examMode === 'fixed'
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Book className={`h-5 w-5 ml-2 ${examMode === 'fixed' ? 'text-primary-600' : 'text-gray-500'}`} />
              <span>امتحان قياسي (محدد)</span>
            </button>
            <button
              onClick={() => { setExamMode('ai'); setExamType('ai'); }}
              className={`flex-1 py-3 rounded-lg border-2 flex items-center justify-center ${
                examMode === 'ai'
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Brain className={`h-5 w-5 ml-2 ${examMode === 'ai' ? 'text-primary-600' : 'text-gray-500'}`} />
              <span>امتحان ذكي (AI)</span>
            </button>
          </div>
          
          {/* امتحان قياسي (عشوائي) أو امتحان ذكي */}
          {(examMode === 'random' || examMode === 'ai') && (
            <div className="space-y-6">
              <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
                <div className="flex items-center mb-3">
                  <Sparkles className="h-5 w-5 text-primary-600 ml-2" />
                  <h3 className="text-primary-800 font-medium">امتحان ذكي باستخدام الذكاء الاصطناعي</h3>
                </div>
                <p className="text-sm text-gray-600">
                  سيقوم النظام بتوليد أسئلة جديدة باستخدام الذكاء الاصطناعي بناءً على نمط الأسئلة الموجودة في التخصص المحدد.
                </p>
              </div>
              
              {/* Common fields for Random and AI exams */}
              <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                  التخصص
                </label>
                <select
                  id="specialization"
                  value={selectedSpecialization}
                  onChange={(e) => {
                    setSelectedSpecialization(e.target.value as typeof selectedSpecialization);
                    setError('');
                  }}
                  className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  disabled={isStartingExam}
                >
                  <option value="">اختر التخصص</option>
                  <option value="software">هندسة البرمجيات</option>
                  <option value="networks">هندسة الشبكات</option>
                  <option value="ai">الذكاء الاصطناعي</option>
                  <option value="general">التخصص العام</option>
                </select>
              </div>

              <div>
                <label htmlFor="questionCount" className="block text-sm font-medium text-gray-700 mb-1">
                  عدد الأسئلة (5-50)
                </label>
                <input
                  type="number"
                  id="questionCount"
                  min="5"
                  max="50"
                  value={questionCount}
                  onChange={(e) => {
                    setQuestionCount(parseInt(e.target.value) || 5);
                    setError('');
                  }}
                  className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  disabled={isStartingExam}
                />
              </div>

              {/* AI Model Selection - only for AI exam mode */}
              {examMode === 'ai' && (
                <div>
                  <label htmlFor="aiModel" className="block text-sm font-medium text-gray-700 mb-1">
                    اختر نموذج الذكاء الاصطناعي
                  </label>
                  <select
                    id="aiModel"
                    value={selectedAiModelId}
                    onChange={(e) => setSelectedAiModelId(Number(e.target.value))}
                    className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    disabled={isStartingExam || aiModels.length === 0}
                  >
                    {aiModels.length === 0 && <option>لا توجد نماذج متاحة</option>}
                    {aiModels.map(model => (
                      <option key={model.id} value={model.id}>{model.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 ml-2" />
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                </div>
              )}
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <HelpCircle className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="mr-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      {examMode === 'ai' ? "معلومات الامتحان الذكي" : "معلومات الامتحان العشوائي"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {examMode === 'ai' 
                        ? `سيتم توليد ${questionCount} سؤال جديد باستخدام نموذج AI المختار من تخصص ${selectedSpecialization ? getSpecializationName(selectedSpecialization) : "محدد"}.`
                        : `سيتم اختيار ${questionCount} سؤال بشكل عشوائي من تخصص ${selectedSpecialization ? getSpecializationName(selectedSpecialization) : "محدد"}.`
                      }
                       مدة الامتحان ستكون {Math.ceil(questionCount * 1.5)} دقيقة.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleStartExam}
                  disabled={!selectedSpecialization || (examMode === 'ai' && !selectedAiModelId) || isStartingExam}
                  className={`btn btn-primary flex items-center ${
                    (!selectedSpecialization || (examMode === 'ai' && !selectedAiModelId) || isStartingExam) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isStartingExam ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-1"></div>
                      {examMode === 'ai' ? 'جاري التوليد...' : 'جاري البدء...'}
                    </>
                  ) : (
                    <>
                      {examMode === 'ai' ? <Sparkles className="h-5 w-5 ml-1" /> : <Play className="h-5 w-5 ml-1" />}
                      {examMode === 'ai' ? 'بدء الامتحان الذكي' : 'بدء الامتحان العشوائي'}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
          
          {/* امتحان قياسي (محدد) */}
          {examMode === 'fixed' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">الامتحانات المتاحة</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockExamPresets.map((exam) => (
                    <div 
                      key={exam.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedPresetId === exam.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => handlePresetSelect(exam.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-base font-medium text-gray-900">{exam.title}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          exam.specialization === 'software' ? 'bg-blue-100 text-blue-800' :
                          exam.specialization === 'networks' ? 'bg-green-100 text-green-800' :
                          exam.specialization === 'ai' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {getSpecializationName(exam.specialization)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{exam.description}</p>
                      <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          <CheckCircle className="h-4 w-4 ml-1" />
                          {exam.questionCount} سؤال
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 ml-1" />
                          {exam.timeLimit} دقيقة
                        </span>
                        <span className="flex items-center">
                          <HelpCircle className="h-4 w-4 ml-1" />
                          المستوى: {getDifficultyName(exam.difficulty)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleStartExam} // Reusing handleStartExam for fixed exams too, ensuring examType is 'normal'
                  disabled={!selectedPresetId || isStartingExam}
                  className={`btn btn-primary flex items-center ${!selectedPresetId || isStartingExam ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Play className="h-5 w-5 ml-1" />
                  بدء الامتحان
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamStart;
 