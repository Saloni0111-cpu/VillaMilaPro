from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    ForgotPasswordAPIView,
    LoginWithOTPView,
    VerifyOTPView,
    ResendOTPView,
    SetPasswordView,
    get_profile   # ✅ ADD THIS
)

urlpatterns = [
    path('register/',        RegisterView.as_view(),        name='register'),
    path('login/',           LoginView.as_view(),           name='login'),
    path('login-otp/',       LoginWithOTPView.as_view(),    name='login-otp'),
    path('forgot-password/', ForgotPasswordAPIView.as_view(), name='forgot-password'),
    path('verify-otp/',      VerifyOTPView.as_view(),       name='verify-otp'),
    path('resend-otp/',      ResendOTPView.as_view(),       name='resend-otp'),
    path('set-password/',    SetPasswordView.as_view(),     name='set-password'),

    path('profile/', get_profile, name='profile'),  # ✅ ADD THIS LINE
]