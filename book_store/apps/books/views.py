"""

This module contains views to handle;
1. Creating, updating and retrieving books.
2. Creating customer orders and updating their statuses by customers and administrators
3. Retrieving summary of the book sales

"""

import os

from PIL import Image

from django.shortcuts import get_object_or_404
from django.conf import settings
from django.utils import timezone
from django.db import transaction
from django.db.models import F, Sum, Q
from django.core.files.storage import  Storage

from rest_framework.views import APIView, Response, status
from rest_framework.exceptions import APIException

from book_store.apps.core.views import APIViewNoAuth

from .serializers import (
    BookSerializer, BookOnlySerializer,
    CreateOrderSerializer, OrderOnlySerializer, OrderSerializer,
    FullOrderSerializer, OrderSerializer1, OrderStatusSerializer,
    SaleSerializer, SaleSerializer1, OrderCancellationSerializer)

from .models import Book, Order, Sale, OrderStatus


class CustomerBooksRetrieveView(APIViewNoAuth):
    
    """
    This view class is for customers' access to books with no authentication

    Allowed Methods:
        `GET`: For retrieving created books. 
        Requires valid Id to get specific book and raises 404 error when id does not exist.
        `id` is not required to get all books.
            
    """

    def get(self, request, id=None):
        data = request.query_params
        
        search_query = data.get("search_query")
        
        if search_query:
            #check search term through the different fields of book
            books = Book.objects.filter(
                Q(title__icontains=search_query)|
                Q(description__icontains=search_query)|
                Q(publisher__icontains=search_query)|
                Q(author_name__icontains=search_query)).all()

            serializer = BookSerializer(books, many=True)

        elif id:
            book = get_object_or_404(Book, id=id)

            serializer = BookSerializer(book)
        
        else:
            books = Book.objects.all()

            serializer = BookSerializer(books, many=True)

        return Response(data=serializer.data)


class BookCreateRetrieveView(APIView):
    """
    This view class is for staff to retrieve and create books

    Allowed Methods:
        `POST`: For creating books. 
        `GET`: For retrieving created books. specify id to get specific book.
    """

    def get(self, request, id=None):
        if id:
            book = get_object_or_404(Book, id=id)

            serializer = BookSerializer(book)
        
        else:
            books = Book.objects.all()

            serializer = BookSerializer(books, many=True)

        return Response(data=serializer.data)

    @transaction.atomic #ensures database state before current operations is retained incase an error occurs during current database operations.
    def post(self, request):

        data = request.data

        # validate supplied json data from post request
        serializer = BookOnlySerializer(data=data)
        
        if serializer.is_valid():
            data = serializer.validated_data 

            image_file_name = self.process_image(data["image_file"])

            data.pop("image_file")

            book = Book.objects.create(**data)

            book.image = image_file_name

            book.save()
            
            return Response("New book saved successfully")
        
    
    @transaction.atomic
    def put(self, request, id):
        data = request.data

        # returns 404 error if book with specified is not available
        book = get_object_or_404(Book, id=id)

        # validate request data before upating book
        serializer = BookOnlySerializer(instance=book, data=data)

        if serializer.is_valid():
            data = serializer.validated_data

            new_image_file = data.pop("image_file")

            image_file_name = book.image

            # Check if old image name is equal to new image name
            # Delete old image if the image names are not the same and replace it with new image
            
            if new_image_file.name != image_file_name: 
                if len(book.image.strip()) != 0:
                    try:
                        os.remove(os.path.join(settings.MEDIA_ROOT, book.image))
                    except:
                        pass

                image_file_name = self.process_image(new_image_file)

            
            book = serializer.save()

            book.image = image_file_name
            
            book.save()
            
            return Response("Updated book details")


    def process_image(self, file):
        """
        This function is responsible for handling the image processing.
        
        1. Parses the image data.
        2. Create new secure file name for the image.
        3. Remove transparency from images if is available.
        4. Resize the image.
        5. Saves the image.
        """

        _, ext = os.path.splitext(file.name)

        new_filename = Storage().get_valid_name("book-image-"+str(timezone.now().timestamp())+ext)

        save_path = os.path.join(settings.MEDIA_ROOT, new_filename)

        image = Image.open(file)
        if image.mode != "RGB":
            image = image.convert("RGB")

        image.thumbnail((1600, 2700))
        image.save(save_path, optimize=True)
        
        return new_filename

class OrderCreateRetrieveView(APIView):
    """
    This view class is for customers to create orders and staff to update order states.

    Allowed Methods:
        POST: For creating orders.
        GET: For retrieving created orders.
        PUT: For updating order states
    """
    def get(self,request, id=None):
        """
            Book data fields returned for customer are different from book data fields returned
            for the staff. This is specified by the different Serializer classes.
        """
        if id:
            if hasattr(request.user, "customer"):
                order = get_object_or_404(Order, id=id, customer__id=request.user.customer.id)

                serializer = OrderSerializer(order)
            else:
                order = get_object_or_404(Order, id=id)
            
                serializer = FullOrderSerializer(order)
        else:
            if hasattr(request.user, "customer"):
                orders = Order.objects.filter(customer__id=request.user.customer.id)\
                    .order_by(F("id").desc())
                serializer = OrderOnlySerializer(orders, many=True)
            else:
                orders = Order.objects.all().order_by(F("id").desc())
                serializer = OrderSerializer1(orders, many=True)

        return Response(data=serializer.data)

    
    def post(self, request):
        data = request.data

        # if authenticated user is not a customer they are denied access to create orders
        if not hasattr(request.user, "customer"):
            return Response(
                "Only customers are allowed to create orders",
                status.HTTP_400_BAD_REQUEST)

        serializer = CreateOrderSerializer(data=data, many=True)

        if serializer.is_valid():
            try:
                with transaction.atomic():
                    data = serializer.validated_data

                    order = Order.objects.create(bill=0)

                    order.customer.add(request.user.customer)

                    for book_sale in data:
                        book = Book.objects.filter(id=book_sale["book_id"]).first()
                        
                        if not book:
                            raise APIException("Sorry book does not exist", status.HTTP_400_BAD_REQUEST)

                        sale = Sale.objects.create(
                            unit_price=book.price,
                            quantity=book_sale["quantity"])
                        
                        order.bill = order.bill + sale.quantity*sale.unit_price

                        order.sales.add(sale)
                        book.sales.add(sale)

                        order.save()
                        book.save()
                return Response("Order has been placed. Check order status in orders section.")
            
            except APIException as e:
                return Response(e.detail, e.detail.code)
            except Exception as e:
                return Response(
                    "Server Error, Please contact system administrator",
                    status.HTTP_500_INTERNAL_SERVER_ERROR)


    @transaction.atomic
    def put(self, request, id):
        """
        This view is for updating order states depending on different user's access rights.
        """
        data = request.data

        order = get_object_or_404(Order, id=id)

        # only orders PENDING and CONFIRMED can be updated.
        if order.status in [OrderStatus.DELIVERED, OrderStatus.CANCELLED]:
            return Response("Sorry, cannot update order status", status.HTTP_400_BAD_REQUEST)

        # cancelled orders required validation of reason for cancellation other wise only validate status
        if data["status"] == OrderStatus.CANCELLED:
            serializer = OrderCancellationSerializer(data=data)
        else:
            serializer = OrderStatusSerializer(data=data)

        if serializer.is_valid():
            data = serializer.validated_data

            if data["status"] == OrderStatus.CANCELLED:
                order.status = OrderStatus.CANCELLED
                order.cancellation_reason = data["reason"]

            elif request.user.is_staff:
                order.status = data["status"]
            else:
                return Response("Sorry, failed to update order status", status.HTTP_400_BAD_REQUEST)
            

            order.save()

            return Response("The status of the order has been updated.")
        
class BookSalesRetrieveView(APIView):
    """
    This view class is for staff to retrieve sales of the book store

    Allowed Methods:
        `GET`: For retrieving the book sales.
    """

    def get(self, request):
        # only sales of CONFIRMED and DELIVERED orders are considered
        sales = Sale.objects.filter(order__status__in=[OrderStatus.CONFIRMED, OrderStatus.DELIVERED]).all()

        serializer = SaleSerializer1(sales, many=True)

        return Response(serializer.data)


class SummaryRetrieveView(APIView):
    """
    This view class is for staff to retrieve summary of the book store

    Allowed Methods:
        `GET`: For retrieving the book store summary.
    """
    def get(self, request):

        books = Book.objects.count()

        orders = Order.objects.count()

        # only sales of CONFIRMED and DELIVERED orders are considered
        sales = Sale.objects.filter(
            order__status__in=[OrderStatus.CONFIRMED, OrderStatus.DELIVERED])\
        .annotate(amount = F('unit_price') * F('quantity'))\
        .aggregate(total = Sum('amount'))

        return Response(
            data={
            "books":books, 
            "orders": orders, 
            "sales": sales["total"]})