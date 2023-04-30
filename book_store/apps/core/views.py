"""
This module contains some shared views.
1. User password reset

"""
import urllib
from django.shortcuts import render
from django.conf import settings
from django.utils import timezone
from django.db import transaction

from rest_framework.views import APIView, Response, status
from rest_framework.exceptions import APIException
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework import serializers

from django.core.mail import send_mail
from django.core.signing import TimestampSigner
from django.contrib.auth.models import User
from django.conf import settings

from django.contrib.auth.tokens import PasswordResetTokenGenerator


class APIViewNoAuth(APIView):
    permission_classes = ()
    authentication_classes = ()


class RequestPasswordResetView(APIViewNoAuth):
    """
    This view class is for requesting for a password reset.

    Allowed Methods:
        POST: For requesting for a password reset.
    """
    def post(self, request):
        data = request.data

        email = data.get("email")

        if email:
            user = User.objects.filter(email__iexact=email).first()
            if user:
                token = PasswordResetTokenGenerator().make_token(user)

                payload = {"session": user.id, "token": token}

                # cryptographic signing of payload
                signer = TimestampSigner(salt="User Password Reset Token Protection")

                payload = signer.sign_object(payload)

                url = settings.WEBSITE_DOMAIN_URL + "/password/reset?token="+payload

                content = f"""
                Use the link below to reset your password. If you didnot request for this reset, please ignore this email.\n
                {url}
                \n
                """

                send_mail("Password Reset",content,from_email=None,recipient_list=[user.email], fail_silently=True)

            return Response(data="Check your email for password reset details if you provided the correct email.")

        else:
            return Response(data="Please provide an email", status=status.HTTP_400_BAD_REQUEST)


class PasswordResetView(APIViewNoAuth):
    """
    This view class is for users to created new passwords using authentication tokens.

    Allowed Methods:
        GET: For verifying is token is valid.
        POST: For creating new password using valid token.
    """
    def get(self, request):
        data = request.query_params
        
        token = data.get("token")

        if not token:
            return Response("Token is required", status.HTTP_400_BAD_REQUEST)

        try:
            signer = TimestampSigner(salt="User Password Reset Token Protection")

            payload = signer.unsign_object(token, max_age=120)

            id = payload.get("session")
            token = payload.get("token")

            user = User.objects.get(id=id)

            verified_user = PasswordResetTokenGenerator().check_token(user=user, token=token)

            if verified_user:
                return Response(data="okay")
            else:
                return Response(data="Link has expired.", status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(data="Either link expired or is incorrect", status=status.HTTP_400_BAD_REQUEST)


    def post(self, request):
        data1 = request.query_params

        data2 = request.data

        token = data1.get("token")
        password = data2.get("password")

        if not token:
            return Response("Token is required", status.HTTP_400_BAD_REQUEST)
        elif not password:
            return Response("Password is required", status.HTTP_400_BAD_REQUEST)

        try:
            signer = TimestampSigner(salt="User Password Reset Token Protection")

            # uncryptolize payload and validate its expiry time
            payload = signer.unsign_object(token, max_age=300)

            id = payload.get("session")
            token = payload.get("token")

            user = User.objects.get(id=id)

            verified_user = PasswordResetTokenGenerator().check_token(user=user, token=token)

            if verified_user:
                user.set_password(password)
                user.save()

                return Response(data="Your new password has been set.")

            else:
                return Response(data="Please request a new password reset.", status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(data="Please request a new password reset.", status=status.HTTP_400_BAD_REQUEST)
