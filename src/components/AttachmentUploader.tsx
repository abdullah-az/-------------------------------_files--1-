import  { useState, useRef, ChangeEvent } from 'react';
import { File, Image, Code, FileText, X } from 'lucide-react';

interface AttachmentUploaderProps {
  onAttachmentChange: (attachment: {
    file: File | null;
    type: 'image' | 'code' | 'text' | 'diagram';
    preview: string | null;
  }) => void;
  initialAttachment?: {
    type: 'image' | 'code' | 'text' | 'diagram';
    content: string;
  };
}

const AttachmentUploader = ({ onAttachmentChange, initialAttachment }: AttachmentUploaderProps) => {
  const [attachmentType, setAttachmentType] = useState<'image' | 'code' | 'text' | 'diagram'>(
    initialAttachment?.type || 'image'
  );
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initialAttachment?.content || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleTypeChange = (type: 'image' | 'code' | 'text' | 'diagram') => {
    setAttachmentType(type);
    
    // Preserve existing preview if changing between code/text/diagram
    if (type !== 'image' && attachmentType !== 'image' && preview) {
      // Keep the current preview
    } else {
      // Reset file and preview when changing type
      setFile(null);
      setPreview(null);
    }
    
    // Notify parent component of the changes
    onAttachmentChange({
      file: null,
      type,
      preview: type !== 'image' && attachmentType !== 'image' ? preview : null
    });
  };
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      setFile(selectedFile);
      
      // Create a preview for the file
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreview(event.target.result as string);
          
          // Notify parent component of the changes
          onAttachmentChange({
            file: selectedFile,
            type: attachmentType,
            preview: event.target.result as string
          });
        }
      };
      
      if (attachmentType === 'image') {
        reader.readAsDataURL(selectedFile);
      } else {
        reader.readAsText(selectedFile);
      }
    }
  };
  
  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setPreview(content);
    
    // Notify parent component of the changes
    onAttachmentChange({
      file: null,
      type: attachmentType,
      preview: content
    });
  };
  
  const handleRemoveAttachment = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (textAreaRef.current) {
      textAreaRef.current.value = '';
    }
    
    // Notify parent component of the changes
    onAttachmentChange({
      file: null,
      type: attachmentType,
      preview: null
    });
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          نوع المرفق
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleTypeChange('image')}
            className={`flex items-center px-3 py-2 rounded-md text-sm ${
              attachmentType === 'image'
                ? 'bg-primary-100 text-primary-700 border border-primary-300'
                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
            }`}
          >
            <Image className="h-4 w-4 ml-1" />
            صورة
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('code')}
            className={`flex items-center px-3 py-2 rounded-md text-sm ${
              attachmentType === 'code'
                ? 'bg-primary-100 text-primary-700 border border-primary-300'
                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
            }`}
          >
            <Code className="h-4 w-4 ml-1" />
            كود
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('text')}
            className={`flex items-center px-3 py-2 rounded-md text-sm ${
              attachmentType === 'text'
                ? 'bg-primary-100 text-primary-700 border border-primary-300'
                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
            }`}
          >
            <FileText className="h-4 w-4 ml-1" />
            نص
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('diagram')}
            className={`flex items-center px-3 py-2 rounded-md text-sm ${
              attachmentType === 'diagram'
                ? 'bg-primary-100 text-primary-700 border border-primary-300'
                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
            }`}
          >
            <File className="h-4 w-4 ml-1" />
            رسم تخطيطي
          </button>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {attachmentType === 'image' ? 'تحميل الصورة' : 
           attachmentType === 'code' ? 'أدخل الكود' : 
           attachmentType === 'text' ? 'أدخل النص' : 'أدخل رابط الرسم التخطيطي'}
        </label>
        {attachmentType === 'image' ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
            {!preview ? (
              <>
                <Image className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-sm text-gray-500 mb-3">
                  قم بتحميل صورة
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-outline"
                >
                  اختر ملف
                </button>
              </>
            ) : (
              <div className="w-full">
                <div className="flex justify-end mb-2">
                  <button
                    type="button"
                    onClick={handleRemoveAttachment}
                    className="p-1 bg-gray-100 rounded-full hover:bg-gray-200"
                    title="إزالة المرفق"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
                <img
                  src={preview}
                  alt="معاينة الصورة"
                  className="max-h-64 mx-auto rounded"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="flex justify-end mb-2">
              {preview && (
                <button
                  type="button"
                  onClick={handleRemoveAttachment}
                  className="p-1 bg-gray-100 rounded-full hover:bg-gray-200"
                  title="إزالة المرفق"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              )}
            </div>
            {attachmentType === 'diagram' ? (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="أدخل رابط الرسم التخطيطي"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={preview || ''}
                  onChange={(e) => {
                    setPreview(e.target.value);
                    onAttachmentChange({
                      file: null,
                      type: attachmentType,
                      preview: e.target.value
                    });
                  }}
                />
                {preview && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">معاينة:</p>
                    <img
                      src={preview}
                      alt="معاينة الرسم التخطيطي"
                      className="max-h-64 mx-auto rounded border border-gray-200"
                    />
                  </div>
                )}
              </div>
            ) : (
              <>
                <textarea
                  ref={textAreaRef}
                  placeholder={
                    attachmentType === 'code' 
                      ? 'أدخل الكود هنا...' 
                      : 'أدخل النص هنا...'
                  }
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md"
                  value={preview || ''}
                  onChange={handleTextChange}
                ></textarea>
                <div className="flex items-center justify-center mt-4">
                  <span className="text-sm text-gray-500">أو</span>
                </div>
                <div className="flex items-center justify-center mt-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".txt,.js,.py,.java,.html,.css,.json,.xml,.md"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-outline"
                  >
                    تحميل ملف
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttachmentUploader;
 