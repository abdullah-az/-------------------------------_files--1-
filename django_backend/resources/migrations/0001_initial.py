# Generated by Django 4.2.2 on 2025-05-09 14:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("questions", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Topic",
            fields=[
                (
                    "id",
                    models.CharField(max_length=50, primary_key=True, serialize=False),
                ),
                ("title", models.CharField(max_length=255, verbose_name="العنوان")),
                ("description", models.TextField(verbose_name="الوصف")),
                (
                    "specialization",
                    models.CharField(
                        choices=[
                            ("software", "هندسة البرمجيات"),
                            ("networks", "هندسة الشبكات"),
                            ("ai", "الذكاء الاصطناعي"),
                            ("general", "التخصص العام"),
                        ],
                        max_length=20,
                        verbose_name="التخصص",
                    ),
                ),
            ],
            options={
                "verbose_name": "موضوع",
                "verbose_name_plural": "مواضيع",
            },
        ),
        migrations.CreateModel(
            name="Resource",
            fields=[
                (
                    "id",
                    models.CharField(max_length=50, primary_key=True, serialize=False),
                ),
                ("title", models.CharField(max_length=255, verbose_name="العنوان")),
                ("description", models.TextField(verbose_name="الوصف")),
                (
                    "type",
                    models.CharField(
                        choices=[
                            ("video", "فيديو"),
                            ("document", "مستند"),
                            ("quiz", "اختبار"),
                        ],
                        max_length=10,
                        verbose_name="النوع",
                    ),
                ),
                (
                    "specialization",
                    models.CharField(
                        choices=[
                            ("software", "هندسة البرمجيات"),
                            ("networks", "هندسة الشبكات"),
                            ("ai", "الذكاء الاصطناعي"),
                            ("general", "التخصص العام"),
                        ],
                        max_length=20,
                        verbose_name="التخصص",
                    ),
                ),
                ("url", models.URLField(blank=True, null=True, verbose_name="الرابط")),
                (
                    "content",
                    models.TextField(blank=True, null=True, verbose_name="المحتوى"),
                ),
                (
                    "created_at",
                    models.DateTimeField(
                        auto_now_add=True, verbose_name="تاريخ الإنشاء"
                    ),
                ),
                (
                    "topic",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="resources",
                        to="resources.topic",
                        verbose_name="الموضوع",
                    ),
                ),
            ],
            options={
                "verbose_name": "مصدر",
                "verbose_name_plural": "مصادر",
            },
        ),
        migrations.CreateModel(
            name="Quiz",
            fields=[
                (
                    "id",
                    models.CharField(max_length=50, primary_key=True, serialize=False),
                ),
                ("title", models.CharField(max_length=255, verbose_name="العنوان")),
                ("description", models.TextField(verbose_name="الوصف")),
                (
                    "specialization",
                    models.CharField(
                        choices=[
                            ("software", "هندسة البرمجيات"),
                            ("networks", "هندسة الشبكات"),
                            ("ai", "الذكاء الاصطناعي"),
                            ("general", "التخصص العام"),
                        ],
                        max_length=20,
                        verbose_name="التخصص",
                    ),
                ),
                (
                    "questions",
                    models.ManyToManyField(
                        related_name="quizzes",
                        to="questions.question",
                        verbose_name="الأسئلة",
                    ),
                ),
            ],
            options={
                "verbose_name": "اختبار",
                "verbose_name_plural": "اختبارات",
            },
        ),
    ]
