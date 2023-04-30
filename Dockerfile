FROM python:3

WORKDIR /book_store_project

COPY requirements.txt ./

RUN apt-get update && echo "Y" | apt-get install libmariadb-dev-compat libmariadb-dev

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

