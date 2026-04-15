# filters.py

import django_filters
from .models import Villa

class VillaFilter(django_filters.FilterSet):
    
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr='lte')

    location = django_filters.CharFilter(field_name="location", lookup_expr='icontains')
    
    rooms = django_filters.NumberFilter(field_name="rooms", lookup_expr='gte')
    guests = django_filters.NumberFilter(field_name="guests", lookup_expr='gte')

    class Meta:
        model = Villa
        fields = ['location', 'rooms', 'guests']

