from django.urls import path
from .views import VillaListCreateView, VillaDetailView, VillaFilterAPIView, ToggleSaveVillaView, SavedVillasView

urlpatterns = [
    path('', VillaListCreateView.as_view()),                         # GET all, POST new
    path('<int:pk>/', VillaDetailView.as_view()),                    # GET one, PUT, DELETE
    path('villas/filter/', VillaFilterAPIView.as_view(), name='villa-filter'),
    path('save/', ToggleSaveVillaView.as_view(), name='villa-save'), # ✅ POST toggle save
    path('saved/', SavedVillasView.as_view(), name='villa-saved'),   # ✅ GET saved villas
]


