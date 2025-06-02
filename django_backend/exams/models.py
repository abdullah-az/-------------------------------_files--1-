from  django.db import models
from django.utils.translation import gettext_lazy as _
from users.models import User
from questions.models import Question
from django.db import models

class AIModel(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name=_("اسم النموذج"))
    api_key = models.CharField(max_length=255, verbose_name=_("مفتاح API"))
    model_identifier = models.CharField(
        max_length=100,
        verbose_name=_("معرف النموذج"),
        help_text=_("المعرف المستخدم لاستدعاء API النموذج"),
    )
    is_active = models.BooleanField(default=True, verbose_name=_("نشط"))

    class Meta:
        verbose_name = _("نموذج ذكاء اصطناعي")
        verbose_name_plural = _("نماذج الذكاء الاصطناعي")

class Exam(models.Model):
    SPECIALIZATION_CHOICES = (
        ('software', 'هندسة البرمجيات'),
        ('networks', 'هندسة الشبكات'),
        ('ai', 'الذكاء الاصطناعي'),
        ('general', 'التخصص العام'),
    )
    
    STATUS_CHOICES = (
        ('ongoing', 'جارٍ'),
        ('completed', 'مكتمل'),
        ('expired', 'منتهي'),
    )
    
    EXAM_TYPE_CHOICES = (
        ('normal', 'امتحان عادي'),
        ('ai', 'امتحان ذكي'),
    )
    
    user = models.ForeignKey(User, verbose_name=_('المستخدم'), on_delete=models.CASCADE, related_name='exams')
    title = models.CharField(_('العنوان'), max_length=255)
    specialization = models.CharField(_('التخصص'), max_length=20, choices=SPECIALIZATION_CHOICES)
    questions = models.ManyToManyField(Question, verbose_name=_('الأسئلة'), through='ExamQuestion')
    question_count = models.PositiveSmallIntegerField(_('عدد الأسئلة'), default=10)
    time_limit = models.PositiveSmallIntegerField(_('الوقت (بالدقائق)'), default=30)
    start_time = models.DateTimeField(_('وقت البدء'), auto_now_add=True)
    end_time = models.DateTimeField(_('وقت الانتهاء'), null=True, blank=True)
    status = models.CharField(_('الحالة'), max_length=10, choices=STATUS_CHOICES, default='ongoing')
    exam_type = models.CharField(_('نوع الامتحان'), max_length=10, choices=EXAM_TYPE_CHOICES, default='normal')
    ai_model = models.ForeignKey(
        AIModel,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_("نموذج الذكاء الاصطناعي"),
        help_text=_("يستخدم فقط إذا كان نوع الامتحان ذكي"),
    )
    score = models.PositiveSmallIntegerField(_('العلامة'), null=True, blank=True)
    correct_answers = models.PositiveSmallIntegerField(_('الإجابات الصحيحة'), null=True, blank=True)
    percentage = models.FloatField(_('النسبة المئوية'), null=True, blank=True)
    
    created_at = models.DateTimeField(_('تاريخ الإنشاء'), auto_now_add=True)
    
    class Meta:
        verbose_name = _('امتحان')
        verbose_name_plural = _('امتحانات')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.user.name}"


class ExamQuestion(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    order = models.PositiveSmallIntegerField(_('الترتيب'), default=0)
    user_answer = models.PositiveSmallIntegerField(_('إجابة المستخدم'), null=True, blank=True)
    is_correct = models.BooleanField(_('إجابة صحيحة'), null=True, blank=True)
    
    class Meta:
        verbose_name = _('سؤال امتحان')
        verbose_name_plural = _('أسئلة امتحان')
        ordering = ['order']
        unique_together = ['exam', 'question']
 