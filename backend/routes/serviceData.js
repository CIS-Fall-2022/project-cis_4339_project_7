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


// delete by id

router.delete('/servicedata/:id', (req, res, next) => {
    servicedata.findOneAndRemove({ serviceID: req.params.id}, (error, data) => {
        if (error) {
          return next(error);
        } else if (data === null) {
            res.status(404).send('Service not found');
        } else {
           res.status(200).json({
             msg: data
           });
        //   res.send('Service has been deleted');
        }
      });
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

//PUT
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