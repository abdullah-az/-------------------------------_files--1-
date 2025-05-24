#!/usr/bin/env  python
"""
هذا النص البرمجي يقوم بإعداد البيانات الأولية للمنصة.
يمكن تشغيله بعد إجراء الترحيل (migration) لقاعدة البيانات.
"""
import os
import sys
import django

# إعداد بيئة Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'educational_platform.settings')
django.setup()

# استيراد النماذج بعد إعداد البيئة
from users.models import User
from questions.models import Question, Option
from resources.models import Topic, Resource, Quiz

def create_users():
    print("إنشاء المستخدمين...")
    # إنشاء مستخدم مشرف
    admin, created = User.objects.get_or_create(
        email='admin@example.com',
        defaults={
            'name': 'مدير النظام',
            'role': 'admin',
            'is_staff': True,
            'is_superuser': True,
        }
    )
    if created:
        admin.set_password('admin123')
        admin.save()
        print("تم إنشاء مستخدم المشرف")
    
    # إنشاء مستخدم طالب
    student, created = User.objects.get_or_create(
        email='student@example.com',
        defaults={
            'name': 'محمد أحمد',
            'role': 'student',
            'university': 'جامعة دمشق',
            'specialty': 'هندسة معلوماتية - السنة الخامسة',
        }
    )
    if created:
        student.set_password('student123')
        student.save()
        print("تم إنشاء مستخدم الطالب")

def create_questions():
    print("إنشاء الأسئلة...")
    # مثال على إنشاء سؤال
    q1, created = Question.objects.get_or_create(
        text='أي من التالي ليس من هياكل البيانات الخطية؟',
        defaults={
            'specialization': 'software',
            'year': '2023',
            'marks': 2,
        }
    )
    if created:
        # إنشاء الخيارات
        option1 = Option.objects.create(question=q1, text='المصفوفة (Array)', is_correct=False)
        option2 = Option.objects.create(question=q1, text='القائمة المتصلة (Linked List)', is_correct=False)
        option3 = Option.objects.create(question=q1, text='الشجرة (Tree)', is_correct=True)
        option4 = Option.objects.create(question=q1, text='المكدس (Stack)', is_correct=False)
        print("تم إنشاء سؤال مع خياراته")

def create_topics_and_resources():
    print("إنشاء المواضيع والمصادر...")
    # إنشاء موضوع
    topic, created = Topic.objects.get_or_create(
        id='algorithms',
        defaults={
            'title': 'الخوارزميات وهياكل البيانات',
            'description': 'المفاهيم الأساسية للخوارزميات وهياكل البيانات وتحليلها وتطبيقها.',
            'specialization': 'software',
        }
    )
    if created:
        print("تم إنشاء موضوع")
    
    # إنشاء مصدر
    resource, created = Resource.objects.get_or_create(
        id='soft-1',
        defaults={
            'title': 'مقدمة في تصميم أنماط البرمجة',
            'description': 'تعرف على أهم أنماط التصميم المستخدمة في هندسة البرمجيات ومتى يجب استخدام كل منها.',
            'type': 'document',
            'specialization': 'software',
            'topic': topic,
        }
    )
    if created:
        print("تم إنشاء مصدر")

def create_quizzes():
    print("إنشاء الاختبارات...")
    # إنشاء اختبار
    if Question.objects.filter(specialization='software').exists():
        questions = Question.objects.filter(specialization='software')
        quiz, created = Quiz.objects.get_or_create(
            id='soft-3',
            defaults={
                'title': 'اختبار معرفتك في هياكل البيانات',
                'description': 'اختبر معرفتك في هياكل البيانات الأساسية والمتقدمة.',
                'specialization': 'software',
            }
        )
        if created:
            quiz.questions.set(questions)
            print("تم إنشاء اختبار وإضافة الأسئلة له")

def main():
    create_users()
    create_questions()
    create_topics_and_resources()
    create_quizzes()
    print("تم إعداد البيانات الأولية بنجاح!")

if __name__ == "__main__":
    main()
 