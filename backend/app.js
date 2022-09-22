const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan"); //better debugging
const cors = require("cors");
//allow using a .env file
require("dotenv").config();   

//creates a new instance of express application
const app = express();

// add cors header to the server
app.use(cors({
  origin: '*'
}));

//sets up mongoose for the mongoDB connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connection Success!");
  })
  .catch((err) => {
    console.error("Mongo Connection Error", err);
  });

//declare port number for the api
const PORT = process.env.PORT || 3000;

//setup
app.use(express.json());
app.use(morgan("dev"));

//import routes
const primaryDataRoute  = require('./routes/primaryData');
const eventsDataRoute  = require('./routes/eventsData');

//setup middle ware for routes
app.use('/primaryData', primaryDataRoute);
app.use('/eventData', eventsDataRoute)

app.listen(PORT, () => {
  console.log("Server started listening on port : ", PORT);
});


// imports servicedata model from serviceData.js file
let serviceDataModel = require('./models/serviceData')

// imports organization model from organizationData.js file
let organizationDataModel = require('./models/organizationData')

// imports primarydata model from primaryData.js file
let primaryDataModel = require('./models/primaryData1')

// imports eventdata model from eventData.js file
let eventDataModel = require('./models/eventData')



///// GETTER method to get  all results from service data doc

app.get('/servicedata', (req, res, next) => {
  
  serviceDataModel.find((error,data) => {
    if (error) {

      return next(error)
    } else {
      res.json(data)
    }
  })
});

///// GETTER method to get  all results from organization data doc
app.get('/organizationdata', (req, res, next) => {
  
  organizationDataModel.find((error,data) => {
    if (error) {

      return next(error)
    } else {
      res.json(data)
    }
  })
});


///// GETTER method to get  all results from primary data doc
app.get('/primarydata', (req, res, next) => {
  
  primaryDataModel.find((error,data) => {
    if (error) {

      return next(error)
    } else {
      res.json(data)
    }
  })
});


///// GETTER method to get  all results from event data doc
app.get('/eventdata', (req, res, next) => {
  
  eventDataModel.find((error,data) => {
    if (error) {

      return next(error)
    } else {
      res.json(data)
    }
  })
});



//error handler
app.use(function (err, req, res, next) {
  // logs error and error code to console
  console.error(err.message, req);
  if (!err.statusCode)
    err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});