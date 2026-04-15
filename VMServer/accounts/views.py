from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.core.mail import send_mail
from django.conf import settings

from .models import EmailOTP
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    ForgotPasswordSerializer,
    VerifyOTPSerializer,
    UserSerializer
)

User = get_user_model()


# =========================
# ✅ REGISTER
# =========================
class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Account created successfully"},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =========================
# ✅ LOGIN (JWT)
# =========================
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data["user"]
            remember = serializer.validated_data.get("remember_me", False)

            refresh = RefreshToken.for_user(user)

            if remember:
                refresh.set_exp(lifetime=None)

            return Response({
                "status": True,
                "message": "Login successful",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": UserSerializer(user).data
            })

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =========================
# ✅ LOGIN WITH OTP
# =========================
class LoginWithOTPView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(request, email=email, password=password)

        if user is None:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        otp_obj, _ = EmailOTP.objects.get_or_create(user=user)
        otp_obj.generate_otp()

        send_mail(
            subject="Your Login OTP",
            message=f"Your OTP code is {otp_obj.otp}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
        )

        return Response({"message": "OTP sent to email"}, status=status.HTTP_200_OK)


# =========================
# ✅ VERIFY OTP
# =========================
class VerifyOTPView(APIView):
    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp = serializer.validated_data['otp']

            try:
                user = User.objects.get(email=email)
                otp_obj = EmailOTP.objects.filter(user=user).last()
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=404)

            if otp_obj is None or otp_obj.otp != otp:
                return Response({"error": "Invalid OTP"}, status=400)

            if otp_obj.is_expired():
                return Response({"error": "OTP expired"}, status=400)

            return Response({"message": "OTP verified successfully"})

        return Response(serializer.errors, status=400)


# =========================
# ✅ RESEND OTP
# =========================
class ResendOTPView(APIView):
    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response({"error": "Email required"}, status=400)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        EmailOTP.objects.filter(user=user).delete()

        otp_obj = EmailOTP.objects.create(user=user)
        otp_obj.generate_otp()

        send_mail(
            subject="New OTP Code",
            message=f"Your new OTP is {otp_obj.otp}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
        )

        return Response({"message": "OTP resent successfully"})


# =========================
# ✅ FORGOT PASSWORD
# =========================
class ForgotPasswordAPIView(APIView):
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = User.objects.get(email=email)

            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)

            reset_link = f"http://localhost:8000/reset-password/{uid}/{token}/"

            send_mail(
                subject="Password Reset",
                message=f"Click here: {reset_link}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
            )

            return Response({"message": "Reset link sent"})

        return Response(serializer.errors, status=400)


# =========================
# ✅ SET PASSWORD
# =========================
class SetPasswordView(APIView):
    def post(self, request):
        email = request.data.get("email")
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        if not email or not new_password or not confirm_password:
            return Response({"error": "All fields required"}, status=400)

        if new_password != confirm_password:
            return Response({"error": "Passwords do not match"}, status=400)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        user.set_password(new_password)
        user.save()

        return Response({"message": "Password updated successfully"})


# =========================
# ✅ PROFILE (GET + UPDATE)
# =========================
@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def get_profile(request):

    # ✅ GET profile
    if request.method == 'GET':
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    # ✅ UPDATE profile
    elif request.method == 'PUT':
        serializer = UserSerializer(
            request.user,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)