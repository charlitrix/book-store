# Book Store API

This is the backend of te book store application handling data storage and access.

## Technologies

- Django Framework (Framework running application).
- Django RestFramework (RESTFUL API access within app)
- Django Cor Headers (For handling CORS)

## Docker Version
[Find it here](https://hub.docker.com/r/charlitrix/book-store-api)

## Installing Requirements

```sh
pip3 install -r requirements.txt
```

## Loading Data

Sample data in available in fixtures folder. You can load it.  
It contains administrator and books

```sh
python3 manage.py loaddata ./fixtures/data.json
```

## Running Tests

### Books App

```sh
python3 manage.py test book_store.apps.books
```

## Running Application

```sh
python3 manage.py runserver
```
