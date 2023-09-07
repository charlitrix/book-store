# Book Store

Book Store is the front end of the Book Store Application for customers to view and purchase books and staff to create books and approve orders.

## Technologies

- React (For the application logic)
- Remix (Framework running application)
- Axios (For API requests)
- Local Storage (For data persistence)

## Docker Version
[Find it here](https://hub.docker.com/r/charlitrix/book-store-api)

## Application Tour

[Check out video here ](https://youtu.be/VZa_RDf-40o)

## Access Urls

- `http://localhost:3000/`: for the customer side.
- `http://localhost:3000/admin`: for the administrator portal (accessed by staff).

### Administrator Portal Access

Username: `c.olet`  
Password: `123`

## Running Application

First install node modules

```sh
npm install
```

To run application in development mode

```sh
npm run dev
```

To run application in production mode;

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```
