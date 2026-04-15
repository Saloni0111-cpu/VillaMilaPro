# # models.py
# from django.db import models


# class ContactMessage(models.Model):
#     full_name = models.CharField(max_length=255)
#     phone_number = models.CharField(max_length=20)
#     email = models.EmailField()
#     address = models.TextField(blank=True)
#     message = models.TextField()
#     created_at = models.DateTimeField(auto_now_add=True)
#     is_read = models.BooleanField(default=False)

#     class Meta:
#         ordering = ['-created_at']
#         verbose_name = 'Contact Message'
#         verbose_name_plural = 'Contact Messages'

#     def __str__(self):
#         return f"{self.full_name} - {self.email} ({self.created_at.strftime('%Y-%m-%d')})"

from django.db import models

class ContactMessage(models.Model):
    full_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    email = models.EmailField()
    address = models.TextField(blank=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Contact Message'
        verbose_name_plural = 'Contact Messages'

    def __str__(self):
        return f"{self.full_name} - {self.email} ({self.created_at.strftime('%Y-%m-%d')})"