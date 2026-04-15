# serializers.py
from rest_framework import serializers
from .models import ContactMessage


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'full_name', 'phone_number', 'email', 'address', 'message', 'created_at', 'is_read']
        read_only_fields = ['id', 'created_at', 'is_read']

    def validate_full_name(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Full name must be at least 2 characters.")
        return value.strip()

    def validate_phone_number(self, value):
        import re
        cleaned = re.sub(r'[\s\-\(\)\+]', '', value)
        if not cleaned.isdigit():
            raise serializers.ValidationError("Phone number must contain only digits, spaces, hyphens, or parentheses.")
        if len(cleaned) < 7 or len(cleaned) > 15:
            raise serializers.ValidationError("Phone number must be between 7 and 15 digits.")
        return value.strip()

    def validate_message(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Message must be at least 10 characters.")
        return value.strip()


class ContactMessageListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing messages (admin use)."""
    class Meta:
        model = ContactMessage
        fields = ['id', 'full_name', 'email', 'phone_number', 'created_at', 'is_read']