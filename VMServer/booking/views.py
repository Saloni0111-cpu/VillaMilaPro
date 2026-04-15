from rest_framework import generics, permissions
from .models import Booking
from .serializers import BookingSerializer
from villas.models import Villa
from datetime import datetime

class BookingCreateView(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only show bookings belonging to the logged-in user
        return Booking.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        check_in = self.request.data.get('check_in')
        check_out = self.request.data.get('check_out')
        villa_id = self.request.data.get('villa')

        try:
            villa = Villa.objects.get(id=villa_id)
        except Villa.DoesNotExist:
            raise ValueError("Villa not found")

        # convert string → date
        check_in_date = datetime.strptime(check_in, "%Y-%m-%d")
        check_out_date = datetime.strptime(check_out, "%Y-%m-%d")

        # calculate days
        days = (check_out_date - check_in_date).days
        if days < 1:
            days = 1 # Smallest booking is 1 night

        # calculate price
        total_price = days * villa.price

        serializer.save(user=self.request.user, total_price=total_price)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Booking

class PaymentView(APIView):
    def post(self, request):
        booking_id = request.data.get('booking_id')

        try:
            booking = Booking.objects.get(id=booking_id)
            booking.is_paid = True
            booking.save()

            return Response({"message": "Payment successful"}, status=status.HTTP_200_OK)

        except Booking.DoesNotExist:
            return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

def get(self, request):
    return Response({"message": "Payment endpoint working"})