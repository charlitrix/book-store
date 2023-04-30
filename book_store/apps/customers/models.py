from django.conf import settings
from django.db import models

from django.contrib.auth.models import User


class Customer(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE)
    
    contact = models.TextField(null=False, blank=False)
    address = models.TextField(blank=True)

    @property
    def first_name(self):
        return self.user.first_name
    
    @property
    def last_name(self):
        return self.user.last_name
    
    @property
    def email(self):
        return self.user.email
    
    @property
    def account(self):
        return "customer"
    
    @property
    def full_name(self):
        return self.first_name + " " + self.last_name