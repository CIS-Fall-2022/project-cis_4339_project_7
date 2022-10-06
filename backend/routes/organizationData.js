const express = require("express");
const router = express.Router();

//importing data model schemas
let { organizationdata } = require("../models/models"); 
let {eventdata} = require("../models/models");
let { primarydata } = require("../models/models"); 

//Post create new orgs
router.post("/createorg", (req, res, next) => { 

//POST
    organizationdata.create( 
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

//GET all entries
router.get("/", (req, res, next) => { 
    organizationdata.find( 
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});

//GET single entry by ID
router.get("/id/:id", (req, res, next) => { 
    organizationdata.find({ organizationID: req.params.id }, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
});

//GET services provided
router.get("/services/:id", (req, res, next) => { 
    organizationdata.aggregate([
        // $match finds an exact match base on the parameters that you set
        // here we have look at the req.body.clientID
        { $match: {
            organizationID: req.params.id
        }},
        // $lookup is like a join in SQL
        { $lookup: {
            from: 'serviceData',
            localField: 'servicesProvided',
            foreignField: 'serviceID',
            as: 'services'
        }}, //{$unwind: '$services'}, not using it but it flattens the results
        // $addFields can create an alias for what you joined the tables "as"
        { $addFields: {
            "service_name": "$services.serviceName"
        }},
        // $project acts like a filter
        // you can pick which fields you want to show from the aggregate pipeline
        { $project: {
            organizationID: 1,
            organizationName: 1,
            service_name: 1
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

//GET all events for organization
router.get("/events/:id", (req, res, next) => { 
    eventdata.find( 
        { organizations: req.params.id }, 
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//GET clients for organization
router.get("/clients/:id", (req, res, next) => { 
    primarydata.find( 
        { clientOfOrgs: req.params.id }, 
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//PUT update org by orgID
router.put("/:id", (req, res, next) => {
    organizationdata.findOneAndUpdate(
        { organizationID: req.params.id },
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

//add serviceID to array
router.put('/addservicefororg/:id', (req, res, next) => {
    organizationdata.findOneAndUpdate({ organizationID: req.params.id, 
        servicesProvided: {$not: { $in: req.body.serviceID }} }, 
        { $addToSet: { servicesProvided : req.body.serviceID} }, 
        (error, data) => {
            if (error) {
                return next(error);
                } else if (data === null) {
                    res.status(409).send('Service is already added or organization does not exist');
                } else {
                res.send('Service for Client is added via PUT');
                console.log('Service for Client successfully added!', data)
                }
      })
});

// delete services in org
router.put('/removeservice/:id', (req, res, next) => {
    organizationdata.findOneAndUpdate({ organizationID: req.params.id,
        servicesProvided : {$in: req.body.serviceID} }, 
        { $pull: { servicesProvided : req.body.serviceID} }, 
        (error, data) => {
            if (error) {
            return next(error);
        } else if (data === null) {
            res.status(409).send('Service has already been removed or organization does not exist');
            } else {
            res.send('Service is removed via PUT');
            console.log('Service successfully removed!', data)
            }
      })
});

//delete organization by ID
router.delete('/removeorg/:id', (req, res, next) => {
    organizationdata.findOneAndRemove({ organizationID: req.params.id}, (error, data) => {
        if (error) {
          return next(error);
        } else if (data === null) {
            res.status(404).send('Organization not found');
        } else {
           res.status(200).json({
             msg: data
           });
        }
     }) ;
});

module.exports = router;
