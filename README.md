# Serverless Application

Simple application using AWS Lambda, API Gateway, DynamoDB and Serverless framework for Udacity Capstone project.
Developed using React in frontend and NodeJS in backend.
Based on [https://github.com/flavioochoa/Serverless-TODO-Application](https://github.com/flavioochoa/Serverless-TODO-Application)


# Functionality of the application

This application will allow creating/removing/updating/fetching places where you have been. Each place item can optionally have multiple attachment image. Each user only has access to the places that he/she has created. Fetched places should appear on Google Map as markers. You can see images taken in the place by clicking on the marker.

# Implemented functionality

* `GetPlaces` - should return all places for a current user.

* `CreatePlace` - should create a new place for a current user.

* `UpdatePlace` - should update a place's info created by a current user.

* `DeletePlace` - should delete a place created by a current user.

# Frontend

The `frontend` folder contains a web application that use the API developed in the project.

To run a front application run the following commands:

```
cd frontend
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless application.

# Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

# Postman collection

You can use the Postman collection that contains sample requests to test backend. You can find a Postman collection in this project.