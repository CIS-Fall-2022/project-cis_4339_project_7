const express = require("express");
const router = express.Router();


//importing data model schemas
let { eventdata } = require("../models/models"); 
//let { servicedata } = require("../models/models"); 
//let { primarydata } = require("../models/models"); 
let { ORG_ID } = require("../app.js")



//GET all events for organization
// reference https://stackoverflow.com/questions/37202585/check-if-value-exists-in-array-field-in-mongodb
router.get("/", (req, res, next) => { 
    eventdata.find( 
        { organizations: ORG_ID }, 
        (error, data) => {
            if (error) {
                return next(error);
            } else if (data.length < 1) {
                res.status(404).send('No events found');
            } else {
                res.json(data);
            }
        }
    );
});



//GET SINGLE ENTRY BY ID
router.get("/id/:id", (req, res, next) => { 
    eventdata.find({ _id: req.params.id,
        organizations : ORG_ID //references back to ORG_ID variable in app.js
     }, 
        (error, data) => {
        if (error) { //error handling
            return next(error)
        } else if (data.length < 1) {
            res.send('No events found').status(404);
        } else {
            res.json(data) // if no error, then respond with json data
        }
    })
});



// GET entries based on search query
router.get("/search/", (req, res, next) => { 
    let dbQuery = "";
    if (req.query["searchBy"] === 'name' && req.query["eventName"].length >= 1) {
        
        dbQuery = { 
            
        eventName: { $regex: `^${req.query["eventName"]}`, $options: "i" }, 
         organizations : ORG_ID
         //description: { $regex: `^${req.query["description"]}`, $options: "i" } 
        }
    } else if (req.query["searchBy"] === 'description' && req.query["description"].length >= 1) {

        dbQuery = {
            "description": { $regex: `^${req.query["description"]}`, $options: "i" },
            organizations : ORG_ID
        }
    } else if (req.query["searchBy"] === 'services' && req.query["serviceID"].length >= 1) {

        dbQuery = {
            "services": { $regex: `^${req.query["serviceID"]}`, $options: "i" },
            organizations : ORG_ID
        }
    } else if (req.query["searchBy"] === 'date' && req.query["date"].length >= 1) {

        dbQuery = {
            "date": { $eq: `${req.query["date"]}`}, //reference https://www.mongodb.com/docs/manual/reference/operator/query/regex/
            organizations : ORG_ID
        }
    };
    eventdata.find( 
        dbQuery, 
        (error, data) => { 
            if (error) {
                return next(error); // error handling
            } else if (data.length < 1) {
                res.send('Event not found').status(404); // respond with no event found if there is nothing matching
            } else {
                res.json(data); // if no error, then respond with json data
            }
        }
    );
});


// GET this retrieves a list of clients attached to an event matching to an organization
router.get("/eventdata1/:id", (req, res, next) => { 
    eventdata.aggregate([
        // $match finds an exact match base on the parameters that you set
        // here we have look at the req.body.clientID
        { $match: {
            _id: req.params.id, organizations : ORG_ID
        }},
        // $lookup is like a join in SQL
        { $lookup: {
            from: 'primaryData',
            localField: 'attendees',
            foreignField: '_id',
            as: 'clients' //reference https://stackoverflow.com/questions/17223517/mongoose-casterror-cast-to-objectid-failed-for-value-object-object-at-path
        }}, 
        {$unwind: '$clients'},
        // $addFields can create an alias for what you joined the tables "as"
        { $addFields: {
            "client_firstname": "$clients.firstName",
            "client_lastname" : "$clients.lastName",
            "client_email" : "$clients.email",
            "client_phonenumber" : "$clients.phoneNumbers"
        }},
        // $project acts like a filter
        // you can pick which fields you want to show from the aggregate pipeline
        { $project: {
            _id : 0,
            client_firstname: 1,
            client_lastname : 1,
            client_email : 1,
            client_phonenumber : 1
        }}
        // can use $count to count how many attendees are signed up for each event
        //this number would be useful for the frontend graph and table we need to create
    ] , (error, data) => {
            if (error) {
                return next(error);
            } else if (data.length < 1) {
                res.status(404).send('No Clients found for event');
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});



//keep
// Shows how many clients signed up for an event by the last 2 months
router.get("/last2months", (req, res, next) => {
    var pastDate = new Date(); // reference https://stackoverflow.com/questions/7937233/how-do-i-calculate-the-date-in-javascript-three-months-prior-to-today
    pastDate.setMonth(pastDate.getMonth() - 2); //subtractiing 2 months from today
    eventdata.aggregate([
        {$match:{ /// finds an exact match on the data we have in mongodb
            date :{

                $gte: pastDate, //furthest date is 2 months from today
                $lt: new Date() // today is shown as Date()
            },
            organizations : ORG_ID
        }},
        {
            $project: {
                _id: 0,
                eventName: 1,
                date: 1,
                number_of_clients : {$size: '$attendees'} //counts number of elements in array
            }
        }
    ], (error, data) => {
        if (error) {
            return next(error);
        } else if (data.length < 1) {
            res.status(404).send('No events in the past 2 months'); // error handler
        } else {
            res.json(data);
        }
    }).sort({ 'updatedAt': -1 }).limit(10);
});




//POST adds events to event collection
router.post("/event", (req, res, next) => { 
    eventdata.create(
        {   
            eventName : req.body.eventName,
            organizations : ORG_ID,
            services : req.body.services,
            date : req.body.date,
            address : req.body.address,
            description : req.body.description,
            attendees : req.body.attendees
        },
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.send('Event created'); 
            }
        }
    );
});

//keep
//PUT that updates based on id in parameter url. 
router.put("/:id", (req, res, next) => {
    eventdata.findOneAndUpdate(
        { _id: req.params.id, organizations : ORG_ID },
        req.body,
        (error, data) => {
            if (error) {
                return next(error);
            } else if (data.length === null) {
                res.status(404).send('Event not found');
            } else {
                res.send('Event has been updated');
            }
        }
    );
});




//keep
// PUT that adds clientIDs to events
router.put('/addattendee/:id', (req, res, next) => {
    eventdata.findOneAndUpdate({ _id: req.params.id, organizations : ORG_ID,
        attendees: {$not: { $in: req.body.attendee }}},
        { $addToSet: { attendees : req.body.attendee } },
        (error, data) => {
            if (error) {
            return next(error);
            } else if (data === null) {
            res.send('Attendee is already in there or event does not exist').status(409);
            } else {
            res.send('Attendee ID is added to event array in eventData via PUT');
            }
      })
});

// PUT that
// Removes attendees from attendees array in eventData collection
router.put('/removeattendees/:id', (req, res, next) => {
    eventdata.findOneAndUpdate({ _id: req.params.id,
        attendees : {$in: req.body.attendee}, organizations : ORG_ID },
        { $pull: { attendees : req.body.attendee} },  // reference https://stackoverflow.com/questions/15625633/nodejs-mongoose-mongodb-pull-from-array-not-working
        (error, data) => {
            if (error) {
            return next(error);
            } else if (data === null) {
            res.status(409).send('Event does not exist');
            } else {
            res.send('Attendee ID is removed from array in eventData via PUT');
            }
      })
});

/// DELETE BY ID
router.delete('/eventdata/:id', (req, res, next) => {
    eventdata.findOneAndRemove({ _id: req.params.id}, (error, data) => {
        if (error) { // reference https://stackoverflow.com/questions/30417389/the-findoneandremove-and-findoneandupdate-dont-work-as-intended
          return next(error);
        } else {
           res.status(200).send('The event has been deleted');
        }
      });
});

module.exports = router;
