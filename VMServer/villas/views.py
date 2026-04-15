# from rest_framework import generics
# from .models import Villa
# from .serializers import VillaSerializer


# class VillaListCreateView(generics.ListCreateAPIView):
#     serializer_class = VillaSerializer

#     def get_queryset(self):
#         return Villa.objects.all()  # Called fresh on every request


# class VillaDetailView(generics.RetrieveUpdateDestroyAPIView):  # Added Update + Destroy
#     serializer_class = VillaSerializer

#     def get_queryset(self):
#         return Villa.objects.all()  # Called fresh on every request


from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Villa
from .serializers import VillaSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .filters import VillaFilter
from .utils import calculate_distance


class VillaListCreateView(generics.ListCreateAPIView):
    serializer_class = VillaSerializer

    def get_queryset(self):
        queryset = Villa.objects.all()

        # Location filter — e.g. ?location=Alibaug
        location = self.request.query_params.get('location')
        if location:
            queryset = queryset.filter(location__icontains=location)

        # Distance filter — e.g. ?distance=5
        distance = self.request.query_params.get('distance')
        if distance:
            queryset = queryset.filter(distance_to_station__icontains=distance)

        # Price filter — e.g. ?max_price=8000
        max_price = self.request.query_params.get('max_price')
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        # Rooms filter — e.g. ?rooms=2
        rooms = self.request.query_params.get('rooms')
        if rooms:
            queryset = queryset.filter(rooms__gte=rooms)

        # Guests filter — e.g. ?guests=4
        guests = self.request.query_params.get('guests')
        if guests:
            queryset = queryset.filter(guests__gte=guests)

        # Sorting — e.g. ?sort=price or ?sort=rating
        sort = self.request.query_params.get('sort')
        if sort == 'price':
            queryset = queryset.order_by('price')
        elif sort == 'rating':
            queryset = queryset.order_by('-rating')

        return queryset


class VillaDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = VillaSerializer

    def get_queryset(self):
        return Villa.objects.all()

class VillaFilterAPIView(APIView):

    def get(self, request):
        queryset = Villa.objects.all()

        # 🔹 Apply django-filter (price, rooms, guests, location)
        villa_filter = VillaFilter(request.GET, queryset=queryset)
        queryset = villa_filter.qs

        # 🔹 Distance filtering
        user_lat = request.GET.get('lat')
        user_lng = request.GET.get('lng')
        max_distance = request.GET.get('distance')  # in KM

        if user_lat and user_lng and max_distance:
            filtered_villas = []

            for villa in queryset:
                if villa.latitude and villa.longitude:
                    distance = calculate_distance(
                        float(user_lat),
                        float(user_lng),
                        villa.latitude,
                        villa.longitude
                    )

                    if distance <= float(max_distance):
                        filtered_villas.append(villa)

            queryset = filtered_villas

        serializer = VillaSerializer(queryset, many=True)
        return Response(serializer.data)


# ✅ TOGGLE SAVE VILLA — POST /api/villas/save/
class ToggleSaveVillaView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        villa_id = request.data.get('villa_id')
        if not villa_id:
            return Response({'error': 'villa_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            villa = Villa.objects.get(pk=villa_id)
        except Villa.DoesNotExist:
            return Response({'error': 'Villa not found'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        if villa in user.saved_villas.all():
            user.saved_villas.remove(villa)
            return Response({'status': 'removed', 'message': 'Villa removed from saved list'})
        else:
            user.saved_villas.add(villa)
            return Response({'status': 'saved', 'message': 'Villa saved successfully'})


# ✅ GET SAVED VILLAS — GET /api/villas/saved/
class SavedVillasView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        saved = request.user.saved_villas.all()
        serializer = VillaSerializer(saved, many=True, context={'request': request})
        return Response(serializer.data)