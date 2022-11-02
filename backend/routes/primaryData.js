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

/// Delete this? yep!
// GET this retrieves a list of organizations by name for a specified client
router.get("/listoforgforclientbyid/:id", (req, res, next) => { 
    primarydata.aggregate([
        // $match finds an exact match base on the parameters that you set
        // here we have look at the req.body.clientID
        { $match: {
            clientID: req.params.id,
        }},
        // $lookup is like a join in SQL
        { $lookup: {
            from: 'organizationData',
            localField: 'clientOfOrgs',
            foreignField: 'organizationID',
            as: 'organizations'
        }}
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
//DELETE this
// PUT this updates the clientOfOrgs array
// Adds a new organization to the list that the client belongs to
router.put('/addclienttoorg/:id', (req, res, next) => {
    primarydata.findOneAndUpdate({ clientID: req.params.id, 
        clientOfOrgs: {$not: {$in: ORG_ID}} }, 
        { $addToSet: { clientOfOrgs : ORG_ID} },
        (error, data) => {
            if (error) {
            return next(error);
            } else if (data === null) {
                res.status(409).send('Organization is already added or client does not exist');
            } else {
            res.send('Organization Client is added via PUT');
            console.log('Organization Client successfully added!', data);
            }
      })
});
//DELETE this
// PUT this updates the clientOfOrgs array
// Removes a specified organization from the client's list
router.put('/removeclientorg/:id', (req, res, next) => {
    primarydata.findOneAndUpdate({ clientID: req.params.id,
        clientOfOrgs: {$in: req.body.organizationID}}, 
        { $pull: { clientOfOrgs: {$in: ORG_ID}} }, 
        (error, data) => {
            if (error) {
            return next(error);
            } else if (data === null) {
                res.status(409).send('Organization is already removed or client does not exist');
            } else {
            res.send('Organization Client is removed via PUT');
            console.log('Organization Client successfully removed!', data)
            }
      })
});
// DELETE
// PUT this updates the servicesNeeded array
// Adds a new service to the client's list
router.put('/addserviceforclient/:id', (req, res, next) => {
    primarydata.findOneAndUpdate({ clientID: req.params.id,
        servicesNeeded: {$not: { $in: req.body.serviceID }} }, 
        { $addToSet: { servicesNeeded : req.body.serviceID} }, 
        (error, data) => {
            if (error) {
            return next(error);
            } else if (data === null) {
                res.status(409).send('Service is already added or client does not exist');
            } else {
            res.send('Service for Client is added via PUT');
            console.log('Service for Client successfully added!', data)
            }
      })
});

//DELETE
// PUT this updates the servicesNeeded array
// Removes a specified service from the client's list
router.put('/removeserviceforclient/:id', (req, res, next) => {
    primarydata.findOneAndUpdate({ clientID: req.params.id, 
    servicesNeeded : {$in: req.body.serviceID} }, 
        { $pull: { servicesNeeded : req.body.serviceID} }, 
        (error, data) => {
            if (error) {
            return next(error);
            } else if (data === null) {
                res.status(409).send('Service has already been removed or client does not exist');
            } else {
                res.send('Service for Client is removed via PUT');
                console.log('Service for Client successfully removed!', data)
            }
            
      })
});

// DELETE OPS DELETE Method

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