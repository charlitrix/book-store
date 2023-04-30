from django.db import transaction
from django.contrib.auth.models import User, Group, Permission
from rest_framework.authtoken.models import Token
from django.contrib.contenttypes.models import ContentType
from django.db.models.signals import post_migrate
from django.dispatch import receiver


@receiver(post_migrate)
def create_system_administrator(sender, **kwargs):
    with transaction.atomic():
        group, created = Group.objects.get_or_create(
            name="Administrator", defaults={"name": "Administrator"})
        if created:
            if not User.objects.filter(is_superuser=True).first():
                obj = User.objects.create_superuser(
                    username="c.olet",
                    email="charlitrix1@gmail.com",
                    password="123",
                    first_name="Olet",
                    last_name="Charles",
                    is_staff=True)
                obj.groups.add(group)
                Token.objects.create(user=obj)
                obj.save()
