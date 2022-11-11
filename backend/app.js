/* References used

For MongoDB Documentation:
https://www.mongodb.com/docs/manual/introduction/

For Mongoose documentation:
https://mongoosejs.com/docs/guide.html

For JavaScript Documentation:
https://www.w3schools.com/js/

For error status codes:
https://metamug.com/article/status-codes-for-rest-api.html#:~:text=409%20Conflict%20%2D%20Client%20attempting%20to,without%20the%20Content%2DLength%20Header.

Method to check for element in array:
https://stackoverflow.com/questions/37202585/check-if-value-exists-in-array-field-in-mongodb

How to use an aggregate pipeline:
https://medium.com/fasal-engineering/fetching-data-from-different-collections-via-mongodb-aggregation-operations-with-examples-a273f24bfff0

//reference https://www.mongodb.com/docs/manual/reference/operator/query/regex/

FindOneAndUpdate fixing: https://stackoverflow.com/questions/30417389/the-findoneandremove-and-findoneandupdate-dont-work-as-intended

How to use $pull correctly: https://stackoverflow.com/questions/15625633/nodejs-mongoose-mongodb-pull-from-array-not-working

How to use FindOneAndUpdate documentation: https://www.mongodb.com/docs/manual/reference/method/db.collection.findOneAndUpdate/

What is $regex: https://www.mongodb.com/docs/manual/reference/operator/query/regex/

Get current date and date from 2 months ago: https://stackoverflow.com/questions/7937233/how-do-i-calculate-the-date-in-javascript-three-months-prior-to-today

Mongoose errors regarding objectID: https://stackoverflow.com/questions/17223517/mongoose-casterror-cast-to-objectid-failed-for-value-object-object-at-path
*/

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
const PORT = process.env.PORT || 27017;
const ORG_ID = process.env.ORG_ID;
module.exports = {ORG_ID}
//setup
app.use(express.json());
app.use(morgan("dev"));

//import routes
const primaryDataRoute  = require('./routes/primaryData');
const eventsDataRoute  = require('./routes/eventsData');
//const serviceDataRoute = require('./routes/serviceData');
//const organizationDataRoute = require('./routes/organizationData');

//setup middle ware for routes
app.use('/primaryData', primaryDataRoute);
app.use('/eventData', eventsDataRoute);
//app.use('/serviceData', serviceDataRoute);
//app.use('/organizationData', organizationDataRoute);

app.listen(PORT, () => {
  console.log("Server started listening on port : ", PORT);
  console.log(ORG_ID);
});


//error handler
app.use(function (err, req, res, next) {
  // logs error and error code to console
  console.error(err.message, req);
  if (!err.statusCode)
    err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});