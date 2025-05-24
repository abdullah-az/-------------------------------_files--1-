from  django.db import models
from django.utils.translation import gettext_lazy as _
from questions.models import Question

class Topic(models.Model):
    SPECIALIZATION_CHOICES = (
        ('software', 'هندسة البرمجيات'),
        ('networks', 'هندسة الشبكات'),
        ('ai', 'الذكاء الاصطناعي'),
        ('general', 'التخصص العام'),
    )
    
    id = models.CharField(max_length=50, primary_key=True)
    title = models.CharField(_('العنوان'), max_length=255)
    description = models.TextField(_('الوصف'))
    specialization = models.CharField(_('التخصص'), max_length=20, choices=SPECIALIZATION_CHOICES)
    
    class Meta:
        verbose_name = _('موضوع')
        verbose_name_plural = _('مواضيع')
    
    def __str__(self):
        return self.title


class Resource(models.Model):
    TYPE_CHOICES = (
        ('video', 'فيديو'),
        ('document', 'مستند'),
        ('quiz', 'اختبار'),
    )
    
    SPECIALIZATION_CHOICES = (
        ('software', 'هندسة البرمجيات'),
        ('networks', 'هندسة الشبكات'),
        ('ai', 'الذكاء الاصطناعي'),
        ('general', 'التخصص العام'),
    )
    
    id = models.CharField(max_length=50, primary_key=True)
    title = models.CharField(_('العنوان'), max_length=255)
    description = models.TextField(_('الوصف'))
    type = models.CharField(_('النوع'), max_length=10, choices=TYPE_CHOICES)
    specialization = models.CharField(_('التخصص'), max_length=20, choices=SPECIALIZATION_CHOICES)
    topic = models.ForeignKey(Topic, verbose_name=_('الموضوع'), on_delete=models.CASCADE, related_name='resources')
    url = models.URLField(_('الرابط'), blank=True, null=True)
    content = models.TextField(_('المحتوى'), blank=True, null=True)
    created_at = models.DateTimeField(_('تاريخ الإنشاء'), auto_now_add=True)
    
    class Meta:
        verbose_name = _('مصدر')
        verbose_name_plural = _('مصادر')
    
    def __str__(self):
        return self.title


class Quiz(models.Model):
    SPECIALIZATION_CHOICES = (
        ('software', 'هندسة البرمجيات'),
        ('networks', 'هندسة الشبكات'),
        ('ai', 'الذكاء الاصطناعي'),
        ('general', 'التخصص العام'),
    )
    
    id = models.CharField(max_length=50, primary_key=True)
    title = models.CharField(_('العنوان'), max_length=255)
    description = models.TextField(_('الوصف'))
    specialization = models.CharField(_('التخصص'), max_length=20, choices=SPECIALIZATION_CHOICES)
    questions = models.ManyToManyField(Question, verbose_name=_('الأسئلة'), related_name='quizzes')
    
    class Meta:
        verbose_name = _('اختبار')
        verbose_name_plural = _('اختبارات')
    
    def __str__(self):
        return self.title
 