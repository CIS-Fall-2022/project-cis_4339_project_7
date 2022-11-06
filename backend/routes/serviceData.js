const express = require("express");
const router = express.Router();

//importing data model schemas
let { servicedata } = require("../models/models"); 

//GET all entries
router.get("/", (req, res, next) => { 
    servicedata.find( 
        (error, data) => {
            if (error) {
                return next(error);
            } else if (data.length < 1) {
                res.status(404).send('No services found');
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});

//GET single entry by ID
router.get("/id/:id", (req, res, next) => { 
    servicedata.find({ serviceID: req.params.id }, (error, data) => {
        if (error) {
            return next(error);
        } else if (data.length < 1) {
            res.status(404).send('Service not found');
        } else {
            res.json(data)
        }
    })
});


//POST
router.post("/createservice", (req, res, next) => { 
    servicedata.create( 
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

//PUT - UPDATES BY ID - PUT SERVICE ID IN URL
router.put("/:id", (req, res, next) => {
    servicedata.findOneAndUpdate(
        { serviceID: req.params.id },
        req.body,
        (error, data) => {
            if (error) {
                return next(error);
            } else if (data === null) {
                res.status(404).send('Service not found');
            } else {
                res.json(data);
            }
        }
    );
});

module.exports = router;