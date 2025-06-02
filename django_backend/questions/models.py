from  django.db import models
from django.utils.translation import gettext_lazy as _

class Question(models.Model):
    SPECIALIZATION_CHOICES = (
        ('software', 'هندسة البرمجيات'),
        ('networks', 'هندسة الشبكات'),
        ('ai', 'الذكاء الاصطناعي'),
        ('general', 'التخصص العام'),
    )
    
    ATTACHMENT_TYPE_CHOICES = (
        ('image', 'صورة'),
        ('code', 'كود'),
        ('text', 'نص'),
        ('diagram', 'رسم تخطيطي'),
    )
    
    text = models.TextField(_('نص السؤال'))
    specialization = models.CharField(_('التخصص'), max_length=20, choices=SPECIALIZATION_CHOICES)
    year = models.CharField(_('سنة الدورة'), max_length=4)
    marks = models.PositiveSmallIntegerField(_('العلامة'), default=1)
    DIFFICULTY_CHOICES = (
        ('easy', 'سهل'),
        ('medium', 'متوسط'),
        ('hard', 'صعب'),
    )
    difficulty = models.CharField(
        _('درجة الصعوبة'),
        max_length=10,
        choices=DIFFICULTY_CHOICES,
        default='medium',
        blank=False,
        null=False
    )
    
    # مرفق السؤال (اختياري)
    has_attachment = models.BooleanField(_('يحتوي على مرفق'), default=False)
    attachment_type = models.CharField(_('نوع المرفق'), max_length=10, choices=ATTACHMENT_TYPE_CHOICES, blank=True, null=True)
    attachment_content = models.TextField(_('محتوى المرفق'), blank=True, null=True)
    
    created_at = models.DateTimeField(_('تاريخ الإنشاء'), auto_now_add=True)
    updated_at = models.DateTimeField(_('تاريخ التحديث'), auto_now=True)
    
    class Meta:
        verbose_name = _('سؤال')
        verbose_name_plural = _('أسئلة')
        ordering = ['-created_at']
    
    def __str__(self):
        return self.text[:50]


class Option(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='options')
    text = models.CharField(_('نص الخيار'), max_length=255)
    is_correct = models.BooleanField(_('إجابة صحيحة'), default=False)
    
    class Meta:
        verbose_name = _('خيار')
        verbose_name_plural = _('خيارات')
    
    def __str__(self):
        return self.text[:30]
 