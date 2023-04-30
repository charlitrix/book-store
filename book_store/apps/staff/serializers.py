from rest_framework import serializers, fields

from django.contrib.auth.models import User
from book_store.apps.core.serializers import ModelSerializer, Serializer


class StaffSerializer(ModelSerializer):

    account = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "username", 
            "first_name", 
            "last_name", 
            "email", 
            "password",
            "account")
        extra_kwargs = {
            "password": {"write_only": True}}
        
    def get_account(self, obj):
        if obj.is_staff:
            return "administrator"
        return ""

