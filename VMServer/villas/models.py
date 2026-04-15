# from django.db import models

# class Villa(models.Model):

#     title = models.CharField(max_length=255)
#     name = models.CharField(max_length=200)

#     location = models.CharField(max_length=200)

#     distance_to_station = models.CharField(max_length=100)

#     guests = models.IntegerField()

#     rooms = models.IntegerField()

#     baths = models.IntegerField()

#     price = models.IntegerField()

#     nights = models.IntegerField(default=1)

#     rating = models.FloatField(default=4.0)

#     image = models.ImageField(upload_to='villa_images/')

#     amenities = models.JSONField()

#     latitude = models.FloatField(null=True, blank=True)

#     longitude = models.FloatField(null=True, blank=True)

#     created_at = models.DateTimeField(auto_now_add=True)

#     def _str_(self):
#         return self.title

#     def __str__(self):
#         return self.name

from django.db import models

class Villa(models.Model):
    #title = models.CharField(max_length=255)
    title = models.CharField(max_length=255, default="Default Title")
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    distance_to_station = models.CharField(max_length=100)
    guests = models.IntegerField()
    rooms = models.IntegerField()
    baths = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    nights = models.IntegerField(default=1)
    rating = models.FloatField(default=4.0)
    image = models.ImageField(upload_to='villa_images/')
    amenities = models.JSONField()
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.location}"

    class Meta:
        ordering = ['-created_at']