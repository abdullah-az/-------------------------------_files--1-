from  rest_framework import serializers
from .models import Question, Option

class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'text', 'is_correct']


class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, read_only=True)
    attachment = serializers.SerializerMethodField()
    correct_answer = serializers.SerializerMethodField()
    options_text = serializers.ListField(child=serializers.CharField(), write_only=True)
    correct_option_index = serializers.IntegerField(write_only=True)

    class Meta:
        model = Question
        fields = [
            'id', 'text', 'specialization', 'year', 'marks', 
            'options', 'attachment', 'correct_answer', 
            'options_text', 'correct_option_index',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_attachment(self, obj):
        if obj.has_attachment:
            return {
                'type': obj.attachment_type,
                'content': obj.attachment_content
            }
        return None
    
    def get_correct_answer(self, obj):
        try:
            options = obj.options.all()
            for index, option in enumerate(options):
                if option.is_correct:
                    return index
            return -1  # إذا لم يتم العثور على إجابة صحيحة
        except:
            return -1

    def create(self, validated_data):
        options_text = validated_data.pop('options_text')
        correct_option_index = validated_data.pop('correct_option_index')
        
        # إنشاء السؤال الجديد
        question = Question.objects.create(**validated_data)
        
        # إنشاء الخيارات
        for index, option_text in enumerate(options_text):
            Option.objects.create(
                question=question,
                text=option_text,
                is_correct=(index == correct_option_index)
            )
        
        return question
    
    def update(self, instance, validated_data):
        options_text = validated_data.pop('options_text', None)
        correct_option_index = validated_data.pop('correct_option_index', None)
        
        # تحديث بيانات السؤال
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # تحديث الخيارات إذا تم تقديمها
        if options_text is not None and correct_option_index is not None:
            # حذف الخيارات الحالية
            instance.options.all().delete()
            
            # إنشاء خيارات جديدة
            for index, option_text in enumerate(options_text):
                Option.objects.create(
                    question=instance,
                    text=option_text,
                    is_correct=(index == correct_option_index)
                )
        
        return instance
 