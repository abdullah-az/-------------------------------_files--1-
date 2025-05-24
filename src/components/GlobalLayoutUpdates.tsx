import  { useEffect } from 'react';

const GlobalLayoutUpdates = () => {
  useEffect(() => {
    // إضافة علامة التحميل النمطية للصفحة
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rotation {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
      
      .loader {
        width: 48px;
        height: 48px;
        border: 5px solid #e5e7eb;
        border-bottom-color: #4f46e5;
        border-radius: 50%;
        display: inline-block;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
      }
    `;
    document.head.appendChild(style);
    
    // إضافة خط Tajawal
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap';
    document.head.appendChild(fontLink);
    
    // تعيين اتجاه الصفحة للعربية
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
    
    // تنظيف عند تفكيك المكون
    return () => {
      document.head.removeChild(style);
      document.head.removeChild(fontLink);
    };
  }, []);
  
  return null;
};

export default GlobalLayoutUpdates;
 