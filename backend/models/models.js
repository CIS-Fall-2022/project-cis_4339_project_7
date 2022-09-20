const uuid = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//collection for serviceData 
let serviceDataSchema = new Schema({ 
    _id: {type: String, default: uuid.v1}, 
    serviceName: {
        type: String, 
        require: true
    }, 
    serviceDescription: {
        type: String, 
        require: true}
    },{
        collection: 'serviceData',
        timestamps: true
    }); 

//collection for intakeData
let primaryDataSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    firstName: {
        type: String,
        require: true
    },
    middleName: {
        type: String,
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    phoneNumbers: {
        type: Array,
        required: true
    },
    address: {
        line1: {
            type: String
        },
        line2: {
            type: String,
        },
        city: {
            type: String,
            required: true
        },
        county: {
            type: String,
        },
        zip: {
            type: String,
        }
    },
    servicesNeeded: [{
        type: ObjectID,
        ref: 'serviceData'
    }]
}, {
    collection: 'primaryData',
    timestamps: true
});

//collection for organizationData 
let organizationDataSchema = new Schema({ 
    _id: {type: String, default: uuid.v1}, 
    organizationName: {
        type: String, 
        require: true
    },
    servicesProvided: [{
        type: ObjectID,
        ref: 'serviceData'
    }]
    },{
        collection: 'organizationData',
        timestamps: true 
    }); 

//collection for eventData
let eventDataSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    eventName: {
        type: String,
        require: true
    },
    organizations: [{
        type: ObjectID,
        ref: 'organizationData'
    }],
    services: [{
        type: ObjectID,
        ref: 'serviceData'
    }],
    date: {
        type: Date,
        required: true
    },
    address: {
        line1: {
            type: String
        },
        line2: {
            type: String,
        },
        city: {
            type: String,
        },
        county: {
            type: String,
        },
        zip: {
            type: String,
        }
    },
    description: {
        type: String,
    },
    attendees: [{
        type: ObjectID,
        ref: 'primaryData'
    }]
}, {
    collection: 'eventData'
});

// create models from mongoose schemas
const servicedata = mongoose.model('serviceData', serviceDataSchema);
const primarydata = mongoose.model('primaryData', primaryDataSchema);
const organizationdata = mongoose.model('organizationData', organizationDataSchema);
const eventdata = mongoose.model('eventData', eventDataSchema);

// package the models in an object to export 
module.exports = { servicedata, primarydata, organizationdata, eventdata }
