import React, { useState, useEffect } from 'react';
import aiService from '../../api/aiService';
import { Save, Settings, Brain } from 'lucide-react';

// قائمة بنماذج الذكاء الاصطناعي المتاحة (يمكن توسيعها لاحقًا)
const aiModels = [
  // OpenAI Models
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo (OpenAI)' },
  { id: 'gpt-4', name: 'GPT-4 (OpenAI)' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo (OpenAI)' },
  { id: 'gpt-4o', name: 'GPT-4o (OpenAI - Latest)' },
  // Anthropic Models
  { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus (Anthropic)' },
  { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet (Anthropic)' },
  { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku (Anthropic)' },
  // Google Models
  { id: 'gemini-1.0-pro', name: 'Gemini 1.0 Pro (Google)' },
  { id: 'gemini-1.5-pro-latest', name: 'Gemini 1.5 Pro (Google - Latest)' },
  // OpenRouter Free Models
  { id: 'openrouter/deepseek/deepseek-r1:free', name: 'DeepSeek R1 (OpenRouter - Free)' },
  { id: 'mistralai/mistral-7b-instruct', name: 'Mistral 7B Instruct (OpenRouter - Free)' }, // Assuming this is free based on search context
  // أضف نماذج أخرى هنا إذا لزم الأمر
];

const AISettings = () => {
  const [selectedModel, setSelectedModel] = useState<string>(aiModels[0]?.id || '');
  const [apiKey, setApiKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState<string>('');

  // تحميل الإعدادات المحفوظة عند تحميل المكون
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const settings = await aiService.getAISettings();
        if (settings.model) {
          setSelectedModel(settings.model);
        }
        if (settings.api_key) {
          setApiKey(settings.api_key);
        }
      } catch (error) {
        console.error('خطأ في تحميل الإعدادات:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSaveStatus('idle');

    try {
      // حفظ الإعدادات باستخدام خدمة الذكاء الاصطناعي
      await aiService.saveAISettings({
        model: selectedModel,
        api_key: apiKey
      });
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000); // إخفاء رسالة النجاح بعد 3 ثوان
    } catch (error) {
      console.error('خطأ في حفظ الإعدادات:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsLoading(false);
    }
  };
  
  // اختبار الاتصال بخدمة الذكاء الاصطناعي
  const handleTestConnection = async () => {
    if (!apiKey || !selectedModel) {
      setTestStatus('error');
      setTestMessage('يرجى إدخال مفتاح API ونموذج الذكاء الاصطناعي أولاً');
      setTimeout(() => setTestStatus('idle'), 3000);
      return;
    }
    
    setTestStatus('testing');
    setTestMessage('');
    
    try {
      const result = await aiService.testAIConnection({
        model: selectedModel,
        api_key: apiKey
      });
      
      setTestStatus('success');
      setTestMessage(result.message);
      setTimeout(() => setTestStatus('idle'), 3000);
    } catch (error) {
      console.error('خطأ في اختبار الاتصال:', error);
      setTestStatus('error');
      setTestMessage('فشل الاتصال بخدمة الذكاء الاصطناعي. تأكد من صحة المفتاح والنموذج.');
      setTimeout(() => setTestStatus('idle'), 3000);
    }
  };

  return (
    <div className="py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-6">
          <Settings className="h-8 w-8 text-primary-600 ml-3" />
          <h1 className="text-3xl font-bold text-gray-900">إعدادات الذكاء الاصطناعي</h1>
        </div>
        <p className="text-gray-600 mb-8">
          قم بتكوين نموذج الذكاء الاصطناعي ومفتاح الـ API الخاص به لاستخدامه في توليد أسئلة الامتحان الذكي.
        </p>

        <form onSubmit={handleSaveSettings} className="bg-white shadow-md rounded-lg p-6 space-y-6">
          <div>
            <label htmlFor="aiModel" className="block text-sm font-medium text-gray-700 mb-1">
              اختر نموذج الذكاء الاصطناعي
            </label>
            <div className="relative">
              <select
                id="aiModel"
                name="aiModel"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pr-10"
              >
                {aiModels.map(model => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Brain className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              سيتم استخدام هذا النموذج لتوليد الأسئلة في وضع "الامتحان الذكي".
            </p>
          </div>

          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
              مفتاح الـ API (API Key)
            </label>
            <input
              type="password" // استخدام type="password" لإخفاء المفتاح
              id="apiKey"
              name="apiKey"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="أدخل مفتاح الـ API الخاص بك هنا"
            />
            <p className="mt-2 text-xs text-gray-500">
              مفتاح الـ API ضروري للتواصل مع خدمة الذكاء الاصطناعي. تأكد من إدخاله بشكل صحيح.
              <strong className='text-red-500'> لا تشارك هذا المفتاح مع أحد.</strong>
            </p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="mb-4">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testStatus === 'testing' || !apiKey || !selectedModel}
                className={`btn btn-secondary flex items-center ${testStatus === 'testing' || !apiKey || !selectedModel ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {testStatus === 'testing' ? (
                  <>
                    <span className="loader-btn mr-2"></span>
                    جاري اختبار الاتصال...
                  </>
                ) : (
                  <>
                    <Brain className="ml-1 h-5 w-5" />
                    اختبار الاتصال
                  </>
                )}
              </button>
              
              {testStatus === 'success' && (
                <p className="text-green-600 mt-2">{testMessage || 'تم الاتصال بنجاح!'}</p>
              )}
              {testStatus === 'error' && (
                <p className="text-red-600 mt-2">{testMessage || 'فشل الاتصال. تأكد من صحة المفتاح والنموذج.'}</p>
              )}
            </div>
            
            <div className="flex items-center justify-end">
              {saveStatus === 'success' && (
                <p className="text-green-600 mr-4">تم حفظ الإعدادات بنجاح!</p>
              )}
              {saveStatus === 'error' && (
                <p className="text-red-600 mr-4">حدث خطأ أثناء حفظ الإعدادات. حاول مرة أخرى.</p>
              )}
              <button
                type="submit"
                disabled={isLoading || !apiKey}
                className={`btn btn-primary flex items-center ${isLoading || !apiKey ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <span className="loader-btn mr-2"></span>
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="ml-1 h-5 w-5" />
                    حفظ الإعدادات
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AISettings;