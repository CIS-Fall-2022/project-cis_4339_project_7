const express = require("express"); 
const router = express.Router(); 

//importing data model schemas
let { primarydata } = require("../models/models"); 
let { organizationdata } = require("../models/models"); 

//GET all entries
router.get("/", (req, res, next) => { 
    primarydata.find( 
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
    primarydata.find( 
        { _id: req.params.id }, 
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});


// DELETE BY ID

router.delete('/primarydata/:id', (req, res, next) => {

    primarydata.findOneAndRemove({ _id: req.params.id}, (error, data) => {
        if (error) {
          return next(error);
        } else {
           res.status(200).json({
             msg: data
           });
        }
      });
});



//GET entries based on search query
//Ex: '...?firstName=Bob&lastName=&searchBy=name' 
//Ex: '...?phoneNumbers=555-555-8888&searchBy=number'
router.get("/search/", (req, res, next) => { 
    let dbQuery = "";
    if (req.query["searchBy"] === 'name') {
        dbQuery = { firstName: { $regex: `^${req.query["firstName"]}`,
         $options: "i" }, lastName: { $regex: `^${req.query["lastName"]}`, $options: "i" } }
    } else if (req.query["searchBy"] === 'number') {
        dbQuery = {
            "phoneNumbers": { $regex: `^${req.query["phoneNumbers"]}`, 
            $options: "i" }
        }
    };
    primarydata.find( 
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

//GET events for a single client
router.get("/events/:id", (req, res, next) => { 
    
});

//POST
router.post("/", (req, res, next) => { 
    primarydata.create( 
        req.body,
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

//PUT update (make sure req body doesn't have the id)
router.put("updateclient/:id", (req, res, next) => { 
    primarydata.findOneAndUpdate( 
        { clientID : req.params.id }, 
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

router.put('/addclienttoorg/:id', (req, res, next) => {
    primarydata.findOneAndUpdate({ clientID: req.params.id }, 
        { $addToSet: { clientOfOrgs : req.body.organizationID} }, 
        (error, data) => {
            if (error) {
            return next(error);
            } else {
            res.send('Organization Client is added via PUT');
            console.log('Organization Client successfully added!', data)
            }
      })
});

router.get("/listoforgforclientbyid", (req, res, next) => { 
    primarydata.aggregate([
        // $match finds an exact match base on the parameters that you set
        // here we have look at the req.body.clientID
        { $match: {
            clientID: req.body.clientID
        }},
        // $lookup is like a join in SQL
        { $lookup: {
            from: 'organizationData',
            localField: 'clientOfOrgs',
            foreignField: 'organizationID',
            as: 'organizations'
        }}, //{$unwind: '$organizations'}, not using it but it flattens the results
        // $addFields can create an alias for what you joined the tables "as"
        { $addFields: {
            "organization_name": "$organizations.organizationName"
        }},
        // $project acts like a filter
        // you can pick which fields you want to show from the aggregate pipeline
        { $project: {
            clientID: 1,
            firstName: 1,
            lastName: 1,
            organization_name: 1
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

module.exports = router;