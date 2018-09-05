# Build restful api with authentication using json web token (JWT) 

## The main workflow of this is that we will

**Have unprotected and protected routes
A user will authenticate by passing in a name and a password and get back a token
The user will store this token on their client-side and send it for every request
We will validate this token, and if all is good, pass back information in JSON format**

## Our API will be built with
**normal routes (not authenticated)
route middleware to authenticate the token
route to authenticate a user and password and get a token
authenticated routes to get all users**

### Create API Routes
***This includes the following routes:***

**POST http://localhost:4000/api/authenticate : Check name and password against the database and provide a token if authentication successful. This route will not require a token because this is where we get the token.**

**GET http://localhost:4000/api : Show a random message. This route is protected and will require a token.**

**GET http://localhost:4000/api/users List all users. This route is protected and will require a token.**

#### Also
***Create Basic Routes These are the unprotected routes like the home page (http://localhost:4000). We'll also create a /setup route here so that we can create a sample user in our new database***