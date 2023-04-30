"""
This module contains views to handle;
1. Staff authentication
2. Staff details update
3. Staff password update

"""

from django.shortcuts import get_object_or_404

from rest_framework.views import APIView, Response, status

from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from book_store.apps.core.views import APIViewNoAuth
from book_store.apps.core.serializers import (
    CredentialsSerializer, UpdatePasswordSerializer)

from .serializers import StaffSerializer


class LoginView(APIViewNoAuth):
    """
    This view class is for staff to log into the adminstrator portal.

    Allowed Methods:
        POST: For logging in.
    """
    def post(self, request):
        data = request.data

        serializer = CredentialsSerializer(data=data)

        if serializer.is_valid():
            data = serializer.validated_data
            user = authenticate(
                username=data["username"],
                password=data["password"])

            # only staff are allowed to login using this view.
            if user and user.is_staff:
                data = {
                    "user": StaffSerializer(user).data, 
                    "token": user.auth_token.key
                }

                return Response(data=data)
            else:
                return Response(data="Wrong user name or password", status=status.HTTP_400_BAD_REQUEST)


class UserUpdateRetrieveView(APIView):
    """
    This view class is for authenticated staff retrieve their details and update their details.

    Allowed Methods:
        GET: For retrieving authenticated staff details.
        PUT: For updating authenticated staff details
    """

    def get(self, request):
        user = User.objects.get(id=request.user.id)

        serializer = StaffSerializer(user)

        return Response(data = serializer.data)


    def put(self, request):
        data = request.data
        obj = get_object_or_404(User, id=request.user.id)

        serializer = StaffSerializer(obj, data=data)
        serializer.Meta.extra_kwargs["password"] = {"read_only": True}

        if serializer.is_valid():
            serializer.save()

            return Response(data="Updated information successfully")


class PasswordUpdateView(APIView):
    """
    This view class is for authenticated staff to update their password.

    Allowed Methods:
        PUT: For updating authenticated staff password
    """

    def put(self, request):
        data = request.data

        serializer = UpdatePasswordSerializer(data=data)

        if serializer.is_valid():
            data = serializer.validated_data

            current_password = data["current_password"]

            new_password = data["new_password"]

            user_obj = get_object_or_404(User, id=request.user.id)

            if user_obj.check_password(current_password):
                user_obj.set_password(new_password)
                user_obj.save()

                return Response(data="New password has been set. Log out and try to log in with new password.")
            else:
                return Response(data="Please enter the correct current password", status=status.HTTP_400_BAD_REQUEST)

