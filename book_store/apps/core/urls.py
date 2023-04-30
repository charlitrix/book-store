from django.urls import path

from .views import RequestPasswordResetView, PasswordResetView

urlpatterns = [
    path("password/reset/request", RequestPasswordResetView.as_view(), name="request_password_reset_view"),

    path("password/reset", PasswordResetView.as_view(), name="password_reset_view"),
]