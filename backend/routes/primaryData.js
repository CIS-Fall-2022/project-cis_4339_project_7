const express = require("express"); 
const router = express.Router(); 

//importing data model schemas
let { primarydata } = require("../models/models"); 
let { eventdata } = require("../models/models");
let { ORG_ID } = require("../app.js")

// CRUD OPS

// CREATE OPS POST Method

//POST create new client

router.post("/", (req, res, next) => { 
    primarydata.create(
        {   clientID : req.body.clientID,
            firstName : req.body.firstName,
            middleName : req.body.middleName,
            lastName : req.body.lastName,
            email : req.body.email,
            phoneNumbers : req.body.phoneNumbers,
            address : req.body.address,
            clientOfOrgs : ORG_ID
        },
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data); 
            }
        }
    );
    console.log(primarydata.createdAt);
    console.log(primarydata.updatedAt);
    console.log(primarydata.createdAt instanceof Date);
});

// READ OPS GET Method

// GET all entries
router.get("/", (req, res, next) => { 
    primarydata.find( 
        {clientOfOrgs: ORG_ID},
        (error, data) => {
            if (error) {
                return next(error);
            } else if (data.length < 1) {
                res.status(404).send('No Clients found');
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});

// GET single entry by ID
router.get("/id/:id", (req, res, next) => {
    primarydata.findOne( 
        { clientID: req.params.id,
        clientOfOrgs: ORG_ID}, 
        (error, data) => {
            if (error) {
                return next(error);
            } else if (data === null) {
                res.status(404).send('Client not found');
            } else {
                res.json(data);
            }
        }
    );
});

// GET entries based on search query
// Ex: '...?firstName=Bob&lastName=&searchBy=name' 
// Ex: '...?phoneNumbers=555-555-8888&searchBy=number'
router.get("/search/", (req, res, next) => { 
    let dbQuery = "";
    if (req.query["searchBy"] === 'name' && 
    (req.query["firstName"].length >= 1 || req.query["lastName"].length >= 1)) {
        dbQuery = { firstName: { $regex: `^${req.query["firstName"]}`,
         $options: "i" }, lastName: { $regex: `^${req.query["lastName"]}`, $options: "i" }, 
         clientOfOrgs: ORG_ID}
    } else if (req.query["searchBy"] === 'number' && req.query["phoneNumbers"].length >= 1) {
        dbQuery = {
            "phoneNumbers": { $regex: `^${req.query["phoneNumbers"]}`, 
            $options: "i" },
            clientOfOrgs: ORG_ID
        }
    };
    primarydata.find( 
        dbQuery, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else if (data.length < 1) {
                res.status(404).send('Client not found');
            } else {
                res.json(data);
            }
        }
    );
});

//MAY NOT NEED !!!!
// GET events for a single client
router.get("/events/:id", (req, res, next) => { 
    eventdata.find( 
        {   attendees: req.params.id,
            clientOfOrgs: ORG_ID}, 
        (error, data) => {
            if (error) {
                return next(error);
            } else if (data.length < 1) {
                res.status(404).send('Client not found');
            } else {
                res.json(data);
            }
        }
    );
});

/////may need to delete//////
/*
// GET gets list of service names for a client by clientID
router.get("/listofsrvcsforclientbyid/:id", (req, res, next) => { 
    primarydata.aggregate([
        // $match finds an exact match base on the parameters that you set
        // here we have look at the req.body.clientID
        { $match: {
            clientID: req.params.id
        }},
        // $lookup is like a join in SQL
        { $lookup: {
            from: 'serviceData',
            localField: 'servicesNeeded',
            foreignField: 'serviceID',
            as: 'services'
        }}, 
        // can use $count to count how many attendees are signed up for each event
        //this number would be useful for the frontend graph and table we need to create
    ] , (error, data) => {
            if (error) {
                return next(error);
            } else if (data.length < 1) {
                res.status(404).send('Client not found');
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});
*/
// UPDATE OPS PUT Method

// PUT update (make sure req body doesn't have the id)
router.put("/updateclient/:id", (req, res, next) => { 
    primarydata.findOneAndUpdate( 
        { clientID : req.params.id }, 
        req.body,
        (error, data) => {
            if (error) {
                return next(error);
            } else if (data === null) {
                res.status(404).send('Client not found');
            } else {
                res.json(data);
            }
        }
    );
});


// DELETE deletes a client from the DB based on clientID
router.delete('/primarydatadel/:id', (req, res, next) => {
    primarydata.findOneAndRemove({ clientID: req.params.id}, (error, data) => {
        if (error) {
          return next(error);
        } else if (data === null) {
            res.status(404).send('Client not found');
        } else {
           res.status(200).json({
             msg: data
           });
        }
      });
});

module.exports = router;