from rest_framework import serializers
from .models import Booking
from villas.serializers import VillaSerializer

class BookingSerializer(serializers.ModelSerializer):
    villa_details = VillaSerializer(source='villa', read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ['total_price', 'user']
