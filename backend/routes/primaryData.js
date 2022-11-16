const express = require("express"); 
const router = express.Router(); 

//importing data model schemas
let { primarydata } = require("../models/models"); 
let { eventdata } = require("../models/models");
let { organizationdata } = require("../models/models");
let { ORG_ID } = require("../app.js");
const { stringify } = require("uuid");


// CRUD OPS

// CREATE OPS POST Method

//POST create new client

router.post("/", (req, res, next) => { 
    primarydata.create(
        {
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
            } else if (data.length === null) {
                res.status(404).send('Client not added.');
            } else {
                res.send('New client added'); 
            }
        }
    );
    console.log(primarydata.createdAt);
    console.log(primarydata.updatedAt);
    console.log(primarydata.createdAt instanceof Date);
});

// READ OPS GET Method

// GET organization name
router.get("/organization", (req, res, next) => { 
    organizationdata.findOne(
        {organizationID: ORG_ID},
        (error, data) => {
            if (error) {
                return next(error);
            } else if (data.length < 1) {
                res.status(404).send('No Organization found');
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});

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
        { _id: req.params.id,
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
    } else if (req.query["searchBy"] === 'number' && req.query["phoneNumbers.primaryPhone"].length >= 1) {
        dbQuery = {
            "phoneNumbers.primaryPhone": { $regex: `^${req.query["phoneNumbers.primaryPhone"]}`, 
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

// UPDATE OPS PUT Method

// PUT update (make sure req body doesn't have the id)
router.put("/updateclient/:id", (req, res, next) => { 
    primarydata.findOneAndUpdate( 
        { _id: req.params.id }, 
        req.body,
        (error, data) => {
            if (error) {
                return next(error);
            } else if (data === null) {
                res.send('Client not found').status(404);
            } else {
                res.send('Client updated');
            }
        }
    );
});


// DELETE deletes a client from the DB based on clientID
router.delete('/primarydatadel/:id', (req, res, next) => {
    primarydata.findOneAndRemove({ _id: req.params.id}, (error, data) => {
        if (error) {
          return next(error);
        } else if (data === null) {
            res.send('Client not found').status(404);
        } else {
           res.json('Client has been removed').status(200);
        }
      });
});

module.exports = router;