const express = require("express");
const router = express.Router();


//importing data model schemas
let { eventdata } = require("../models/models"); 
//let { servicedata } = require("../models/models"); 
//let { primarydata } = require("../models/models"); 




//GET all entries
router.get("/", (req, res, next) => { 
    eventdata.find( 
        (error, data) => {
            if (error) {
                return next(error);
            } else if (data.length < 1) {
                res.status(404).send('No events found');
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});

//GET SINGLE ENTRY BY ID
router.get("/id/:id", (req, res, next) => { 
    eventdata.find({ eventID: req.params.id }, 
        (error, data) => {
        if (error) {
            return next(error)
        } else if (data.length < 1) {
            res.status(404).send('No events found');
        } else {
            res.json(data)
        }
    })
});

// GET entries based on search query
// Ex: '...?firstName=Bob&lastName=&searchBy=name' 
// Ex: '...?phoneNumbers=555-555-8888&searchBy=number'
router.get("/search/", (req, res, next) => { 
    let dbQuery = "";
    if (req.query["searchBy"] === 'name' && req.query["eventName"].length >= 1) {
        
        dbQuery = { 
            
        eventName: { $regex: `^${req.query["eventName"]}`, $options: "i" }, 
         
         //description: { $regex: `^${req.query["description"]}`, $options: "i" } 
        }
    } else if (req.query["searchBy"] === 'description' && req.query["description"].length >= 1) {

        dbQuery = {
            "description": { $regex: `^${req.query["description"]}`, $options: "i" }
        }
    };
    eventdata.find( 
        dbQuery, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else if (data.length < 1) {
                res.status(404).send('Event not found');
            } else {
                res.json(data);
            }
        }
    );
});


// GET this retrieves a list of clients attached to an event
router.get("/eventdata1/:id", (req, res, next) => { 
    eventdata.aggregate([
        // $match finds an exact match base on the parameters that you set
        // here we have look at the req.body.clientID
        { $match: {
            eventID: req.params.id
        }},
        // $lookup is like a join in SQL
        { $lookup: {
            from: 'primaryData',
            localField: 'attendees',
            foreignField: 'clientID',
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




// GET endpoint that will search services attached to an event
router.get("/eventdata2/:id", (req, res, next) => { 
    eventdata.aggregate([
        // $match finds an exact match base on the parameters that you set
        // here we have look at the req.body.clientID
        { $match: {
            eventID: req.params.id
        }},
        // $lookup is like a join in SQL
        { $lookup: {
            from: 'serviceData',
            localField: 'services',
            foreignField: 'serviceID',
            as: 'services',
        },},
        
        {$unwind: '$services'}, 
        // $addFields can create an alias for what you joined the tables "as"
        { $addFields: {
            "servicename": "$services.serviceName",
            "servicedescription" : "$services.serviceDescription",
            "serviceid" : "$services.serviceID",
        }},
        // $project acts like a filter
        // you can pick which fields you want to show from the aggregate pipeline
        { $project: {
            _id : 0,
            servicename : 1,
            servicedescription : 1,
            serviceid : 1,
            eventName : 1
        }}
        // can use $count to count how many attendees are signed up for each event
        //this number would be useful for the frontend graph and table we need to create
    ] , (error, data) => {
            if (error) {
                return next(error);
            } else if (data.length < 1) {
                res.status(404).send('No services found for event');
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});


// Shows how many clients signed up for an event by the last 2 months
router.get("/last2months", (req, res, next) => {
    var pastDate = new Date(); // reference https://stackoverflow.com/questions/7937233/how-do-i-calculate-the-date-in-javascript-three-months-prior-to-today
    pastDate.setMonth(pastDate.getMonth() - 2);
    eventdata.aggregate([
        {$match:{ /// finds an exact match on the data we have in mongodb
            date :{

                $gte: pastDate, //furthest date is 2 months from today
                $lt: new Date() // today is shown as Date()
            }
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



//GET entries based on search query
//Ex: '...?eventName=Food&searchBy=name' 
router.get("/search/", (req, res, next) => { 
    let dbQuery = "";
    if (req.query["searchBy"] === 'name') {
        dbQuery = { eventName: { $regex: `^${req.query["eventName"]}`, $options: "i" } }
    } else if (req.query["searchBy"] === 'date') { //reference https://www.mongodb.com/docs/manual/reference/operator/query/regex/
        dbQuery = {
            date:  req.query["eventDate"]
        }
    };
    eventdata.find( 
        dbQuery, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});



//POST adds events to event collection
router.post("/event", (req, res, next) => { 
    eventdata.create( 
        req.body, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//PUT that updates based on id in parameter url. 
router.put("/:id", (req, res, next) => {
    eventdata.findOneAndUpdate(
        { eventID: req.params.id },
        req.body,
        (error, data) => {
            if (error) {
                return next(error);
            } else if (data.length === null) {
                res.status(404).send('Event not found');
            } else {
                res.json(data);
            }
        }
    );
});


// PUT that adds serviceIDs to events
router.put('/addservices/:id', (req, res, next) => {
    eventdata.findOneAndUpdate({ eventID: req.params.id, // reference https://www.mongodb.com/docs/manual/reference/method/db.collection.findOneAndUpdate/
        services: {$not: {$in: req.body.serviceID}} },
        { $addToSet: { services : req.body.serviceID } },
        (error, data) => {
            if (error) {
            return next(error);
        } else if (data === null) {
            res.status(409).send('Service is already added or event does not exist');
            } else {
            res.send('Service ID is added to services array in eventData via PUT');
            }
      })
});



// PUT this updates the attendees array
// Removes a specified organization from the client's list
router.put('/removeservices/:id', (req, res, next) => {
    eventdata.findOneAndUpdate({ eventID: req.params.id,
        services: {$in: req.body.serviceID}}, 
        { $pull: { 'services' : req.body.serviceID} }, 
        (error, data) => {
            if (error) {
            return next(error);
        } else if (data === null) {
            res.status(409).send('Service is already removed or event does not exist');
            } else {
            res.send('Service ID is removed from services array in eventData via PUT');
            }
      })
});




// PUT that adds clientIDs to events
router.put('/addattendees/:id', (req, res, next) => {
    eventdata.findOneAndUpdate({ eventID: req.params.id, 
        attendees: {$not: { $in: req.body.clientID }}},
        { $addToSet: { attendees : req.body.clientID } },
        (error, data) => {
            if (error) {
            return next(error);
            } else if (data === null) {
            res.status(409).send('Attendee is already added or event does not exist');
            } else {
            res.send('Attendee ID is added to services array in eventData via PUT');
            }
      })
});

// PUT that
// Removes attendees from attendees array in eventData collection
router.put('/removeattendees/:id', (req, res, next) => {
    eventdata.findOneAndUpdate({ eventID: req.params.id, 
        attendees : {$in: req.body.clientID} }, 
        { $pull: { attendees : req.body.clientID} },  // reference https://stackoverflow.com/questions/15625633/nodejs-mongoose-mongodb-pull-from-array-not-working
        (error, data) => {
            if (error) {
            return next(error);
            } else if (data === null) {
            res.status(409).send('Attendee has already been removed or event does not exist');
            } else {
            res.send('Attendee ID is removed from services array in eventData via PUT');
            }
      })
});



/// DELETE BY ID
router.delete('/eventdata/:id', (req, res, next) => {
    eventdata.findOneAndRemove({ _id: req.params.id}, (error, data) => {
        if (error) { // reference https://stackoverflow.com/questions/30417389/the-findoneandremove-and-findoneandupdate-dont-work-as-intended
          return next(error);
        } else {
           res.status(200).json({
             msg: data
           });
        }
      });
});

//GET all events for organization
// reference https://stackoverflow.com/questions/37202585/check-if-value-exists-in-array-field-in-mongodb
router.get("/events", (req, res, next) => { 
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

module.exports = router;