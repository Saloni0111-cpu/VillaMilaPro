

# Register your models here.
from django.contrib import admin
from .models import Blog

@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'read_time', 'created_at']
    search_fields = ['title', 'author']
    list_filter = ['created_at']
    fieldsets = (
        ('Basic Info', {
            'fields': ('title', 'description', 'author', 'read_time', 'hero_image', 'intro')
        }),
        ('Section 1', {
            'fields': ('section1_title', 'section1_text', 'image1')
        }),
        ('Section 2', {
            'fields': ('section2_title', 'section2_text', 'image2')
        }),
        ('Section 3', {
            'fields': ('section3_title', 'section3_text', 'image3')
        }),
        ('Conclusion', {
            'fields': ('conclusion',)
        }),
    )