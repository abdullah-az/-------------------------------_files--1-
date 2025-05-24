from  django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    """Define a model manager for User model without username field."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError('يجب تحديد البريد الإلكتروني')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('يجب أن يكون Superuser موظفاً (is_staff=True)')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('يجب أن يكون Superuser مسؤولاً (is_superuser=True)')

        return self._create_user(email, password, **extra_fields)


class User(AbstractUser):
    """User model."""

    ROLE_CHOICES = (
        ('admin', 'مشرف'),
        ('student', 'طالب'),
    )

    username = None
    email = models.EmailField(_('البريد الإلكتروني'), unique=True)
    role = models.CharField(_('الدور'), max_length=10, choices=ROLE_CHOICES, default='student')
    name = models.CharField(_('الاسم الكامل'), max_length=255)
    university = models.CharField(_('الجامعة'), max_length=255, blank=True, null=True)
    specialty = models.CharField(_('التخصص'), max_length=255, blank=True, null=True)
    bio = models.TextField(_('نبذة'), blank=True, null=True)
    is_active = models.BooleanField(_('نشط'), default=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    objects = UserManager()

    def __str__(self):
        return self.email
 