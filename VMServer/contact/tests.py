from django.test import TestCase

# Create your tests here.
# tests.py
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import ContactMessage

User = get_user_model()


# ─── Sample Test Data ─────────────────────────────────────────────────────────

VALID_PAYLOAD = {
    "full_name": "John Doe",
    "phone_number": "+1 235 2355 98",
    "email": "john.doe@example.com",
    "address": "198 West 21th Street, Suite 721, New York NY 10016",
    "message": "Hello, I am interested in listing my property with your platform. Please get in touch.",
}

VALID_PAYLOAD_2 = {
    "full_name": "Priya Sharma",
    "phone_number": "9876543210",
    "email": "priya.sharma@gmail.com",
    "address": "Plot 12, Civil Lines, Nagpur, Maharashtra 440001",
    "message": "I want to know more about your holiday rental packages.",
}

VALID_PAYLOAD_NO_ADDRESS = {
    "full_name": "Ali Khan",
    "phone_number": "00971501234567",
    "email": "ali.khan@dubai.ae",
    "address": "",               # address is optional
    "message": "Interested in your premium listings.",
}


# ─── Tests ────────────────────────────────────────────────────────────────────

class ContactMessageCreateTests(TestCase):
    """Tests for POST /api/contact/"""

    def setUp(self):
        self.client = APIClient()
        self.url = reverse('contact-create')

    # ── Success cases ──────────────────────────────────────────────────────

    def test_submit_valid_contact_form(self):
        """Standard valid submission should return 201."""
        response = self.client.post(self.url, VALID_PAYLOAD, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(ContactMessage.objects.count(), 1)

    def test_submit_without_address(self):
        """Address field is optional."""
        response = self.client.post(self.url, VALID_PAYLOAD_NO_ADDRESS, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_response_contains_correct_fields(self):
        """Response data should echo back submitted fields."""
        response = self.client.post(self.url, VALID_PAYLOAD, format='json')
        data = response.data['data']
        self.assertEqual(data['full_name'], VALID_PAYLOAD['full_name'])
        self.assertEqual(data['email'], VALID_PAYLOAD['email'])
        self.assertEqual(data['phone_number'], VALID_PAYLOAD['phone_number'])

    def test_multiple_submissions_stored(self):
        """Each submission creates a new DB record."""
        self.client.post(self.url, VALID_PAYLOAD, format='json')
        self.client.post(self.url, VALID_PAYLOAD_2, format='json')
        self.assertEqual(ContactMessage.objects.count(), 2)

    # ── Validation: required fields ────────────────────────────────────────

    def test_missing_full_name_returns_400(self):
        payload = {**VALID_PAYLOAD}
        del payload['full_name']
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('full_name', response.data['errors'])

    def test_missing_email_returns_400(self):
        payload = {**VALID_PAYLOAD, 'email': ''}
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data['errors'])

    def test_missing_phone_returns_400(self):
        payload = {**VALID_PAYLOAD, 'phone_number': ''}
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('phone_number', response.data['errors'])

    def test_missing_message_returns_400(self):
        payload = {**VALID_PAYLOAD, 'message': ''}
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('message', response.data['errors'])

    # ── Validation: format/content ──────────────────────────────────────────

    def test_invalid_email_format_returns_400(self):
        payload = {**VALID_PAYLOAD, 'email': 'not-an-email'}
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_short_message_returns_400(self):
        """Message must be at least 10 characters."""
        payload = {**VALID_PAYLOAD, 'message': 'Hi'}
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_short_full_name_returns_400(self):
        """Name must be at least 2 characters."""
        payload = {**VALID_PAYLOAD, 'full_name': 'A'}
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_phone_with_letters_returns_400(self):
        payload = {**VALID_PAYLOAD, 'phone_number': 'ABCXYZ'}
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_empty_body_returns_400(self):
        response = self.client.post(self.url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ContactMessageAdminTests(TestCase):
    """Tests for admin-only endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser(
            username='admin', password='adminpass', email='admin@test.com'
        )
        self.user = User.objects.create_user(
            username='regular', password='userpass', email='user@test.com'
        )
        # Pre-populate some messages
        ContactMessage.objects.create(**VALID_PAYLOAD)
        ContactMessage.objects.create(**VALID_PAYLOAD_2)

    # ── List endpoint ──────────────────────────────────────────────────────

    def test_admin_can_list_messages(self):
        self.client.force_authenticate(user=self.admin)
        url = reverse('contact-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 2)

    def test_anonymous_cannot_list_messages(self):
        url = reverse('contact-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_regular_user_cannot_list_messages(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('contact-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # ── Detail endpoint ────────────────────────────────────────────────────

    def test_admin_can_retrieve_message(self):
        self.client.force_authenticate(user=self.admin)
        msg = ContactMessage.objects.first()
        url = reverse('contact-detail', kwargs={'pk': msg.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], msg.email)

    def test_admin_can_mark_as_read(self):
        self.client.force_authenticate(user=self.admin)
        msg = ContactMessage.objects.first()
        url = reverse('contact-detail', kwargs={'pk': msg.pk})
        response = self.client.patch(url, {'is_read': True}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        msg.refresh_from_db()
        self.assertTrue(msg.is_read)

    def test_admin_can_delete_message(self):
        self.client.force_authenticate(user=self.admin)
        msg = ContactMessage.objects.first()
        url = reverse('contact-detail', kwargs={'pk': msg.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(ContactMessage.objects.count(), 1)

    def test_retrieve_nonexistent_returns_404(self):
        self.client.force_authenticate(user=self.admin)
        url = reverse('contact-detail', kwargs={'pk': 9999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class ContactMessageModelTests(TestCase):
    """Unit tests for the model."""

    def test_default_is_read_false(self):
        msg = ContactMessage.objects.create(**VALID_PAYLOAD)
        self.assertFalse(msg.is_read)

    def test_str_representation(self):
        msg = ContactMessage.objects.create(**VALID_PAYLOAD)
        self.assertIn("John Doe", str(msg))
        self.assertIn("john.doe@example.com", str(msg))

    def test_ordering_latest_first(self):
        ContactMessage.objects.create(**VALID_PAYLOAD)
        ContactMessage.objects.create(**VALID_PAYLOAD_2)
        msgs = list(ContactMessage.objects.all())
        self.assertGreaterEqual(msgs[0].created_at, msgs[1].created_at)
