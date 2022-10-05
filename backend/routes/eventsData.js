const express = require("express");
const router = express.Router();


//importing data model schemas
let { eventdata } = require("../models/models"); 
let { servicedata } = require("../models/models"); 
let { primarydata } = require("../models/models"); 




//GET all entries
router.get("/", (req, res, next) => { 
    eventdata.find( 
        (error, data) => {
            if (error) {
                return next(error);
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
        } else {
            res.json(data)
        }
    })
});


// GET this retrieves a list of organizations by name for a specified client
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
            as: 'clients'
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
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});









//GET entries based on search query
//Ex: '...?eventName=Food&searchBy=name' 
router.get("/search/", (req, res, next) => { 
    let dbQuery = "";
    if (req.query["searchBy"] === 'name') {
        dbQuery = { eventName: { $regex: `^${req.query["eventName"]}`, $options: "i" } }
    } else if (req.query["searchBy"] === 'date') {
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



//POST
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

//PUT
router.put("/:id", (req, res, next) => {
    eventdata.findOneAndUpdate(
        { eventID: req.params.id },
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





router.put('/addservices/:id', (req, res, next) => {
    eventdata.findOneAndUpdate(
        { eventID: req.params.id },
        { $addToSet: { services : req.body.serviceID } },
        (error, data) => {
            if (error) {
            return next(error);
            } else {
            res.send('Service ID is added to services array in eventData via PUT');
            }
      })
});


// PUT this updates the clientOfOrgs array
// Removes a specified organization from the client's list
router.put('/removeservice/:id', (req, res, next) => {
    eventdata.findOneAndUpdate({ eventID: req.params.id }, 
        { $pull: { services : req.body.serviceID} }, 
        (error, data) => {
            if (error) {
            return next(error);
            } else {
            res.send('Service ID is removed from services array in eventData via PUT');
            }
      })
});

router.put('/addattendees/:id', (req, res, next) => {
    eventdata.findOneAndUpdate(
        { eventID: req.params.id },
        { $addToSet: { attendees : req.body.clientID } },
        (error, data) => {
            if (error) {
            return next(error);
            } else {
            res.send('Attendee ID is added to services array in eventData via PUT');
            }
      })
});

router.put('/removeattendees/:id', (req, res, next) => {
    eventdata.findOneAndUpdate(
        { eventID: req.params.id }, 
        { $pull: { attendees : req.body.clientID} }, 
        (error, data) => {
            if (error) {
            return next(error);
            } else {
            res.send('Attendee ID is removed from services array in eventData via PUT');
            }
      })
});


/*
//PUT add attendee to event
router.put("/addAttendee/:id", (req, res, next) => {
    //only add attendee if not yet signed up
    eventdata.find( 
        { _id: req.params.id, attendees: req.body.attendee }, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                if (data.length == 0) {
                    eventdata.updateOne(
                        { _id: req.params.id }, 
                        { $push: { attendees: req.body.attendee } },
                        (error, data) => {
                            if (error) {
                                consol
                                return next(error);
                            } else {
                                res.json(data);
                            }
                        }
                    );
                }
                
            }
        }
    );
});

*/



/// DELETE BY ID
router.delete('/eventdata/:id', (req, res, next) => {
    eventdata.findOneAndRemove({ eventID: req.params.id}, (error, data) => {
        if (error) {
          return next(error);
        } else {
           res.status(200).json({
             msg: data
           });
        }
      });
});


module.exports = router;