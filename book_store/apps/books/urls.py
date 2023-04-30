from django.urls import path

from .views import (
    BookCreateRetrieveView, OrderCreateRetrieveView, 
    CustomerBooksRetrieveView, BookSalesRetrieveView,
    SummaryRetrieveView)

urlpatterns = [
    path("", BookCreateRetrieveView.as_view(), name="books_create_retrieve_view"),

    path("<int:id>", BookCreateRetrieveView.as_view(), name="books_retrieve_update_view"),

    path("all", CustomerBooksRetrieveView.as_view(), name="customer_retrieve_books_view"),

    path("all/<int:id>", CustomerBooksRetrieveView.as_view(), name="customer_retrieve_book_view"),

    path("orders", OrderCreateRetrieveView.as_view(), name="orders_create_view"),

    path("orders/<int:id>", OrderCreateRetrieveView.as_view(), name="orders_retrieve_update_view"),

    path("sales", BookSalesRetrieveView.as_view(), name="book_sales_retrieve_view"),

    path("summary", SummaryRetrieveView.as_view(), name="summary_retrieve_view"),
]