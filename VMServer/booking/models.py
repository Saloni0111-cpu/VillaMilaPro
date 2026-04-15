from django.db import models
from django.conf import settings

class Booking(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='bookings')
    villa = models.ForeignKey('villas.Villa', on_delete=models.CASCADE, related_name='bookings')
    name = models.CharField(max_length=100)
    check_in = models.DateField()
    check_out = models.DateField()
    guests = models.IntegerField()
    total_price = models.IntegerField()

    payment_status = models.CharField(max_length=20, default='pending')
    payment_id = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.name
