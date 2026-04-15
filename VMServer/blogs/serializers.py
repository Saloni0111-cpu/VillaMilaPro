from rest_framework import serializers
from .models import Blog

class BlogSerializer(serializers.ModelSerializer):
    hero_image_url = serializers.SerializerMethodField()
    title_image_url = serializers.SerializerMethodField()
    image1_url = serializers.SerializerMethodField()
    image2_url = serializers.SerializerMethodField()
    image3_url = serializers.SerializerMethodField()

    class Meta:
        model = Blog
        fields = '__all__'

    def _build_url(self, obj, field_name):
        request = self.context.get('request')
        file = getattr(obj, field_name)
        if file and request:
            return request.build_absolute_uri(file.url)
        return None

    def get_hero_image_url(self, obj): return self._build_url(obj, 'hero_image')
    def get_title_image_url(self, obj): return self._build_url(obj, 'title_image')
    def get_image1_url(self, obj):     return self._build_url(obj, 'image1')
    def get_image2_url(self, obj):     return self._build_url(obj, 'image2')
    def get_image3_url(self, obj):     return self._build_url(obj, 'image3')