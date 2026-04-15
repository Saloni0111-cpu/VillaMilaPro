from django.urls import path
from .views import BookingCreateView, PaymentView

urlpatterns = [
    path('', BookingCreateView.as_view(), name='booking'),

    path('pay/', PaymentView.as_view(), name='payment'),
]