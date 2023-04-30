from rest_framework import serializers

class Serializer(serializers.Serializer):
    def is_valid(self, raise_exception=True):
        return super(Serializer, self).is_valid(raise_exception=raise_exception)


class ModelSerializer(serializers.ModelSerializer):
    def is_valid(self, raise_exception=True):
        return super(ModelSerializer, self).is_valid(raise_exception=raise_exception)


class CredentialsSerializer(Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


class UpdatePasswordSerializer(Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)