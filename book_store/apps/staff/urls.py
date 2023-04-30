from django.urls import path

from .views import (LoginView, PasswordUpdateView, UserUpdateRetrieveView)

urlpatterns = [
    path("login", LoginView.as_view(), name="staff_login_view"),

    path("user/password/update", PasswordUpdateView.as_view(), name="password_update_view"),

    path("user", UserUpdateRetrieveView.as_view(), name="user_update_retrieve_view")
]