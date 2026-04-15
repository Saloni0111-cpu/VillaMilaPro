# views.py
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.core.mail import send_mail
from django.conf import settings
from .models import ContactMessage
from .serializers import ContactMessageSerializer, ContactMessageListSerializer


class ContactMessageCreateView(APIView):
    """
    POST /api/contact/
    Submit a contact form message. Open to all users (no auth required).
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        if serializer.is_valid():
            contact = serializer.save()

            # Optional: send notification email to admin
            try:
                send_mail(
                    subject=f"New Contact Form Submission from {contact.full_name}",
                    message=(
                        f"Name: {contact.full_name}\n"
                        f"Email: {contact.email}\n"
                        f"Phone: {contact.phone_number}\n"
                        f"Address: {contact.address}\n\n"
                        f"Message:\n{contact.message}"
                    ),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[settings.ADMIN_EMAIL],
                    fail_silently=True,  # Don't crash if mail fails
                )
            except Exception:
                pass  # Email failure should not affect API response

            return Response(
                {
                    "success": True,
                    "message": "Your message has been sent successfully. We'll get back to you soon!",
                    "data": ContactMessageSerializer(contact).data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {"success": False, "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )


class ContactMessageListView(APIView):
    """
    GET /api/contact/messages/
    Admin-only endpoint to list all contact messages.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        messages = ContactMessage.objects.all()
        serializer = ContactMessageListSerializer(messages, many=True)
        return Response(
            {"count": messages.count(), "results": serializer.data},
            status=status.HTTP_200_OK,
        )


class ContactMessageDetailView(APIView):
    """
    GET  /api/contact/messages/<id>/   — retrieve a single message
    PATCH /api/contact/messages/<id>/  — mark as read/unread (admin only)
    DELETE /api/contact/messages/<id>/ — delete a message (admin only)
    """
    permission_classes = [AllowAny]

    def _get_object(self, pk):
        try:
            return ContactMessage.objects.get(pk=pk)
        except ContactMessage.DoesNotExist:
            return None

    def get(self, request, pk):
        contact = self._get_object(pk)
        if not contact:
            return Response({"error": "Message not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = ContactMessageSerializer(contact)
        return Response(serializer.data)

    def patch(self, request, pk):
        contact = self._get_object(pk)
        if not contact:
            return Response({"error": "Message not found."}, status=status.HTTP_404_NOT_FOUND)
        is_read = request.data.get("is_read")
        if is_read is not None:
            contact.is_read = bool(is_read)
            contact.save(update_fields=["is_read"])
        return Response(ContactMessageSerializer(contact).data)

    def delete(self, request, pk):
        contact = self._get_object(pk)
        if not contact:
            return Response({"error": "Message not found."}, status=status.HTTP_404_NOT_FOUND)
        contact.delete()
        return Response({"success": True, "message": "Message deleted."}, status=status.HTTP_204_NO_CONTENT)