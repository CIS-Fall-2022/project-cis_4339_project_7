const express = require("express");
const router = express.Router();

//importing data model schemas
let { organizationdata } = require("../models/models"); 
let {eventdata} = require("../models/models");
let {servicedata} = require("../models/models");

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
    organizationdata.find({ _id: req.params.id }, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
});


//POST
router.post("/createorg", (req, res, next) => { 
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

//PUT
router.put("/:id", (req, res, next) => {
    organizationdata.findOneAndUpdate(
        { _id: req.params.id },
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

//GET services provided
//would this populate multiple services? since service in organization is an array

router.get("/servicesprovided", (req, res, next) => { 
    organizationdata.aggregate([
        // $match finds an exact match base on the parameters that you set
        // here we have look at the req.body.clientID
        { $match: {
            organizationD: req.body.organizationID
        }},
        // $lookup is like a join in SQL
        { $lookup: {
            from: 'serviceData',
            localField: 'servicesProvided',
            foreignField: 'serviceID',
            as: 'services'
        }}, //{$unwind: '$organizations'}, not using it but it flattens the results
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

//GET organizations by name

//GET events for organization
//have to get from event the organizaion name 
//have to go through every single event to see if an org is in the array list

//GET clients for organization

//delete by ID
module.exports = router;