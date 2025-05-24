#!/bin/bash
#  هذا النص البرمجي يقوم بتشغيل جميع الخطوات اللازمة لإعداد وتشغيل الجزء الخلفي من التطبيق

# تفعيل البيئة الافتراضية (يجب إنشاؤها أولاً)
# source venv/bin/activate

# تثبيت المتطلبات
echo "تثبيت المتطلبات..."
pip install -r requirements.txt

# إنشاء ملف .env إذا لم يكن موجوداً
if [ ! -f .env ]; then
    echo "إنشاء ملف .env..."
    cp .env.example .env
fi

# إجراء ترحيل قاعدة البيانات
echo "ترحيل قاعدة البيانات..."
python manage.py makemigrations
python manage.py migrate

# إعداد البيانات الأولية
echo "إعداد البيانات الأولية..."
python setup_initial_data.py

# تشغيل الخادم
echo "تشغيل الخادم..."
python manage.py runserver
 