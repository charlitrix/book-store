from rest_framework import serializers

from book_store.apps.core.serializers import ModelSerializer, Serializer
from book_store.apps.customers.serializers import CustomerSerializer

from .models import Book, Sale, Order, OrderStatus


class BookOnlySerializer(ModelSerializer):

    image_file = serializers.ImageField(write_only=True)

    class Meta:
        model = Book
        exclude = ("sales", "image")


class BookSerializer(ModelSerializer):

    cover_image = serializers.CharField()
    
    class Meta:
        model = Book
        exclude = ("sales",)


class SaleSerializer(ModelSerializer):

    book_title = serializers.SerializerMethodField()

    class Meta:
        model = Sale
        fields = ("id","quantity", "unit_price", "book_title")

    def get_book_title(self, obj):
        book = obj.book_set.first()
        return book.title if book else ""
    
class SaleSerializer1(ModelSerializer):

    book_title = serializers.SerializerMethodField()

    date = serializers.SerializerMethodField()

    customer = serializers.SerializerMethodField()

    class Meta:
        model = Sale
        fields = ("id","quantity", "unit_price", "book_title", "date", "customer")

    def get_book_title(self, obj):
        book = obj.book_set.first()
        return book.title if book else ""
    
    def get_date(self, obj):
        order = obj.order_set.first()
        return order.date if order else ""
    
    def get_customer(self, obj):
        customer = obj.order_set.first().customer.first()

        return customer.full_name if customer else ""

class CreateOrderSerializer(Serializer):
    book_id = serializers.IntegerField(required=True)
    quantity = serializers.IntegerField(required=True)


class OrderOnlySerializer(ModelSerializer):

    class Meta:
        model = Order
        exclude = ("customer", "sales")

class OrderSerializer(ModelSerializer):

    sales = SaleSerializer(many=True)

    class Meta:
        model = Order
        exclude = ("customer",)


class OrderSerializer1(ModelSerializer):
    
    customer_name = serializers.SerializerMethodField()

    class Meta:
        model = Order
        exclude = ("sales",)

    def get_customer_name(self, obj):
        customer = obj.customer.first()
        return customer.full_name


class FullOrderSerializer(ModelSerializer):
    
    sales = SaleSerializer(many=True)

    customer_details = serializers.SerializerMethodField()

    def get_customer_details(self, obj):
        customer = obj.customer.first()

        return CustomerSerializer(customer).data
    
    class Meta:
        model = Order
        fields = "__all__"
        # fields = (
        #     "date", 
        #     "bill",
        #      "status",
        #      "cancellation_reason",
        #      "sales",
        #      "customer_details")

class OrderStatusSerializer(Serializer):
    status = serializers.ChoiceField(OrderStatus.choices)


class OrderCancellationSerializer(Serializer):
    status = serializers.ChoiceField(
        list(
            filter(lambda x: x[0] == 'CANCELLED',OrderStatus.choices)))
    reason = serializers.CharField(required=True, allow_blank=False)