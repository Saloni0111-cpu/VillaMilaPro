from django.urls import path
from django.http import HttpResponse
from .views import (
    ContactMessageCreateView,
    ContactMessageListView,
    ContactMessageDetailView
)

# ✅ Home route for /api/contact/
def contact_home(request):
    return HttpResponse("Contact API working")

urlpatterns = [
    # ✅ base route → /api/contact/
    path('', contact_home),

    # ✅ Public: submit contact form → /api/contact/contact/
    path('contact/', ContactMessageCreateView.as_view(), name='contact-create'),

    # ✅ Admin: list messages → /api/contact/contact/messages/
    path('contact/messages/', ContactMessageListView.as_view(), name='contact-list'),

    # ✅ Admin: detail/update/delete → /api/contact/contact/messages/1/
    path('contact/messages/<int:pk>/', ContactMessageDetailView.as_view(), name='contact-detail'),
]