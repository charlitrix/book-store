from rest_framework import serializers

from book_store.apps.core.serializers import ModelSerializer, Serializer

from .models import Customer

class BaseCustomerSerializer(ModelSerializer):

    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    email = serializers.CharField(required=True)
    contact = serializers.CharField(required=True)
    address = serializers.CharField(required=False, default="", allow_blank=True)


    class Meta:
        abstract = True


class CustomerSerializer(BaseCustomerSerializer):

    class Meta:
        model = Customer
        fields = (
            "first_name", 
            "last_name", 
            "email", 
            "contact",
            "address",
            "account",
            "full_name")


class CreateCustomerSerializer(BaseCustomerSerializer):

    password = serializers.CharField(required=True)

    class Meta:
        model = Customer
        fields = (
            "first_name", 
            "last_name", 
            "email", 
            "contact", 
            "address", 
            "password")