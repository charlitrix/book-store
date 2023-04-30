"""
This module contains view to handle;
1. Customer authentication
2. Customer account creation
3. Customer details update
4. Customer password update
"""

from django.shortcuts import get_object_or_404
from django.db import transaction

from rest_framework.views import APIView, Response, status
from rest_framework.authtoken.models import Token

from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from book_store.apps.core.views import APIViewNoAuth
from book_store.apps.core.serializers import CredentialsSerializer, UpdatePasswordSerializer

from .serializers import CustomerSerializer, CreateCustomerSerializer
from .models import Customer


class LoginView(APIViewNoAuth):
    """
    This view class is to authenticated customers into the system using their email and password.

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

            # check if authenticated user is a customer and this is for customers to login not staff
            if user and hasattr(user, "customer"):
                data = {
                    "user": CustomerSerializer(user.customer).data, 
                    "token": user.auth_token.key
                }

                return Response(data=data)
            else:
                return Response(data="Wrong user name or password", status=status.HTTP_400_BAD_REQUEST)


class UserRetrieveView(APIView):
    """
    This view class is for authenticated customers retrieve their details and update their details.

    Allowed Methods:
        GET: For retrieving authenticated customer details.
        PUT: For updating authenticated customer details
    """
    def get(self, request):

        obj = get_object_or_404(Customer, user__id=request.user.id)

        serializer = CustomerSerializer(obj)
        
        return Response(data = serializer.data)


    def put(self, request):
        data = request.data
        obj = get_object_or_404(Customer, user__id=request.user.id)

        serializer = CustomerSerializer(data=data)

        if serializer.is_valid():
            data = serializer.validated_data

            obj.contact = data["contact"]
            obj.address = data["address"]
            obj.user.first_name = data["first_name"]
            obj.user.last_name = data["last_name"]
            obj.user.email = data["email"]
            obj.user.username = data["email"]

            obj.save()

            return Response(data="Updated information successfully")


class UserCreateView(APIViewNoAuth):

    """
    This view class allows customers to create new accounts within the book store app.

    Allowed Methods:
        POST: For creating new customer accounts
    """

    @transaction.atomic
    def post(self, request):
        data = request.data

        serializer = CreateCustomerSerializer(data=data)

        if serializer.is_valid():
            data = serializer.validated_data

            user_name_exists = User.objects.filter(username__iexact=data["email"])

            if user_name_exists:
                return Response("Sorry try another email, %s is already taken"%data["email"],status.HTTP_400_BAD_REQUEST)

            user = User.objects.create_user(
                username=data["email"],
                email=data["email"],
                first_name=data["first_name"],
                last_name=data["last_name"],
                password=data["password"],
                is_staff=False)
            user.save()

            token = Token.objects.create(
                user=user)
            
            customer = Customer.objects.create(
                user=user,
                contact=data["contact"],
                address=data["address"])
            
            customer.save()

            serializer = CustomerSerializer(customer)

            return Response(
                data={
                "user": serializer.data,
                "token":token.key})


class PasswordChangeView(APIView):
    """
    This view class is for authenticated customers to update their password.

    Allowed Methods:
        PUT: For updating authenticated user password
    """
    def put(self, request):
        data = request.data

        serializer = UpdatePasswordSerializer(data=data)

        if serializer.is_valid():

            current_password = data["current_password"]

            new_password = data["new_password"]

            user_obj = get_object_or_404(User, id=request.user.id)

            if user_obj.check_password(current_password):
                user_obj.set_password(new_password)
                user_obj.save()

                return Response(data="New password has been set. Log out and try to log in with new password. ")
            else:
                return Response(data="Please enter the correct current password", status=status.HTTP_400_BAD_REQUEST)

