from django.contrib.auth.models import User
from django.utils import dateformat, dateparse
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


from .models import Book, Order, Sale


class BookTests(APITestCase):

    @classmethod
    def setUpClass(cls):
        super(BookTests, cls).setUpClass()
        
        cls.superuser, created = User.objects.get_or_create(
            username="test-admin")
        cls.superuser.is_active = True
        cls.superuser.is_superuser = True
        cls.superuser.save()

        cls.book = Book.objects.create(
            title="New Book",
            description="Description of the book",
            image="book_image.jpg",
            price=50000,
            publish_date="2022-04-01",
            publisher="Book publisher",
            author_name="Book Author")
        
        cls.book_to_delete = Book.objects.create(
            title="New Book 2",
            description="Description of second book",
            image="book_image.jpg",
            price=30000,
            publish_date="2020-11-12",
            publisher="Sam Publishers",
            author_name="Sam Author")
        
    @classmethod
    def tearDownClass(cls):
        super(BookTests, cls).tearDownClass()
        cls.book.delete()
        cls.superuser.delete()


    def test_customer_list_books(self):
        """
        customers retrieve all books
        """
        url = reverse("customer_retrieve_books_view")

        data = {}

        response = self.client.get(url, data, format="json")

        self.assertEqual(
            response.status_code, status.HTTP_200_OK)
        
        self.assertEqual(
            len(response.data), Book.objects.count())
        
    def test_staff_list_books_allowed(self):
        """
        staff retrieve all books when authenticated
        """
        #login
        self.client.force_authenticate(user=self.superuser)

        url = reverse("books_create_retrieve_view")

        data = {}

        response = self.client.get(url, data, format="json")

        self.assertEqual(
            response.status_code, status.HTTP_200_OK)
        
        self.assertEqual(
            len(response.data), Book.objects.count())
        
        #logout
        self.client.force_authenticate(user=None)
        
    def test_staff_list_books_restricted(self):
        """
        staff retrieve all books when not authenticated
        """
        #login
        self.client.force_authenticate(user=None)

        url = reverse("books_create_retrieve_view")

        data = {}

        response = self.client.get(url, data, format="json")

        self.assertEqual(
            response.status_code, status.HTTP_401_UNAUTHORIZED)
        
    
    def test_customer_get_book(self):
        """
        customer retrieve specific book
        """
        url = reverse(
            "customer_retrieve_book_view", 
            kwargs={
                "id": self.book.pk})
        
        data = {}
        response = self.client.get(url, data, format="json")

        self.assertEqual(
            response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["id"], self.book.pk)
        self.assertEqual(
            response.data["title"], self.book.title)
        self.assertEqual(
            response.data["description"], self.book.description)
        self.assertEqual(
            response.data["price"], self.book.price)
        # date input format is different from output format
        self.assertEqual(
            response.data["publish_date"], 
            dateformat.format(
            dateparse.parse_date(self.book.publish_date), "d/m/Y"))
        self.assertEqual(
            response.data["image"], self.book.image)
        self.assertEqual(
            response.data["publisher"], self.book.publisher)
        self.assertEqual(
            response.data["author_name"], self.book.author_name)
    
    def test_staff_get_book_allowed(self):
        """
        staff retrieve specific book when authenticated.
        """
        #login
        self.client.force_authenticate(user=self.superuser)
        url = reverse(
            "books_retrieve_update_view", 
            kwargs={
                "id": self.book.pk})
        
        data = {}
        response = self.client.get(url, data, format="json")

        self.assertEqual(
            response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["id"], self.book.pk)
        self.assertEqual(
            response.data["title"], self.book.title)
        self.assertEqual(
            response.data["description"], self.book.description)
        self.assertEqual(
            response.data["price"], self.book.price)
        # date input format is different from output format
        self.assertEqual(
            response.data["publish_date"], 
            dateformat.format(
            dateparse.parse_date(self.book.publish_date), "d/m/Y"))
        self.assertEqual(
            response.data["image"], self.book.image)
        self.assertEqual(
            response.data["publisher"], self.book.publisher)
        self.assertEqual(
            response.data["author_name"], self.book.author_name)
        
        #logout
        self.client.force_authenticate(user=None)
        
    def test_staff_get_book_restricted(self):
        """
        staff retrieve specific book when authenticated.
        """
        self.client.force_authenticate(user=None)
        url = reverse(
            "books_retrieve_update_view", 
            kwargs={
                "id": self.book.pk})
        
        data = {}
        response = self.client.get(url, data, format="json")

        self.assertEqual(
            response.status_code, status.HTTP_401_UNAUTHORIZED)
       
    
