from django.urls import path

from .views import LoginView, UserRetrieveView, UserCreateView, PasswordChangeView

urlpatterns = [
    path("login", LoginView.as_view(), name="customer_login_view"),

    path("register", UserCreateView.as_view(), name="user_create_view"),

    path("user", UserRetrieveView.as_view(), name="user_update_retrieve_view"),

    path("user/password/update", PasswordChangeView.as_view(), name="user_password_update_view"),
]