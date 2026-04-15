from django.db import models

class Blog(models.Model):
    title_image = models.ImageField(upload_to='blogs/title/', null=True, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    author = models.CharField(max_length=100)
    read_time = models.CharField(max_length=50)
    hero_image = models.ImageField(upload_to='blogs/hero/', null=True, blank=True)
    
    intro = models.TextField()

    # Section 1
    section1_title = models.CharField(max_length=255, blank=True)
    section1_text = models.TextField(blank=True)
    image1 = models.ImageField(upload_to='blogs/section1/', null=True, blank=True)

    # Section 2
    section2_title = models.CharField(max_length=255, blank=True)
    section2_text = models.TextField(blank=True)
    image2 = models.ImageField(upload_to='blogs/section2/', null=True, blank=True)

    # Section 3
    section3_title = models.CharField(max_length=255, blank=True)
    section3_text = models.TextField(blank=True)
    image3 = models.ImageField(upload_to='blogs/section3/', null=True, blank=True)

    conclusion = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title