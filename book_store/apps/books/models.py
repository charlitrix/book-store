"""
    This module contains Books model classes that will be mapped to tables in the database.
    They will be used to handle all database queries related to books
"""

from django.db import models
from django.utils import timezone

from django.core.files.storage import default_storage

from book_store.apps.customers.models import Customer

# models
class OrderStatus(models.TextChoices):
    """
        These class contains the different states of an order.

        Choices:
            PENDING (str): This is the first state when order has just been created.
        
            CONFIRMED (str): This is the state when order has been confirmed.

            CANCELLED (str): This is the state when order has been cancelled.

            DELIVERED (str): This is the state when books have been delivered to customer.
    """
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"


class Book(models.Model):

    title = models.TextField(null=False, blank=False)
    image = models.TextField(null=False, blank=False)
    description = models.TextField(null=False, blank=False)
    price = models.IntegerField(null=False)
    publish_date = models.DateField()
    publisher = models.TextField(blank=True)
    author_name = models.TextField(blank=True)

    
    sales = models.ManyToManyField(
        "Sale",
        through="BookSale",
        through_fields=("book", "sale"))
    
    @property
    def cover_image(self):
        return default_storage.url(self.image)


class Order(models.Model):

    date = models.DateField(default=timezone.now)
    bill = models.IntegerField()
    status = models.TextField(choices=OrderStatus.choices, default=OrderStatus.PENDING)
    cancellation_reason = models.TextField(default="")

    sales = models.ManyToManyField(
        "Sale",
        through="OrderSale",
        through_fields=("order", "sale"))
    
    customer = models.ManyToManyField(
        Customer,
        through="CustomerOrder",
        through_fields=( "order", "customer",))


class Sale(models.Model):
    unit_price = models.IntegerField()
    quantity = models.IntegerField()


# association tables
class BookSale(models.Model):
    book = models.ForeignKey(Book, db_index=True, null=True, on_delete=models.CASCADE)
    sale = models.ForeignKey(Sale, db_index=True, null=True, on_delete=models.CASCADE)


class OrderSale(models.Model):
    order = models.ForeignKey(Order, db_index=True, null=True, on_delete=models.CASCADE)
    sale = models.ForeignKey(Sale, db_index=True, null=True, on_delete=models.CASCADE)


class CustomerOrder(models.Model):
    order = models.ForeignKey(Order, db_index=True, null=True, on_delete=models.CASCADE)
    customer = models.ForeignKey(Customer, db_index=True, null=True, on_delete=models.CASCADE)
