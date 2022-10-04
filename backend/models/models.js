const uuid = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//const  ObjectID = require('mongodb').ObjectId;


//collection for serviceData 
let serviceDataSchema = new Schema({ 
    _id: {type: String, default: uuid.v1}, 
    serviceID: {
        type: String,
        require: true,
        unique: true
    },
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
    clientID: {
        type: String,
        require: true,
        unique: true
    },
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
    servicesNeeded: {
        type: [String] // references serviceID in serviceData collection
    },
    clientOfOrgs: {
        type: [String] // references organizationID in organizationData collection
    }}, 
{
    collection: 'primaryData',
    timestamps: true
});

//collection for organizationData 
let organizationDataSchema = new Schema({ 
    _id: {type: String, default: uuid.v1}, 
    organizationID: {
        type: String,
        require: true,
        unique: true
    },
    organizationName: {
        type: String, 
        require: true
    },
    servicesProvided: {
        type: [String] // references serviceID in serviceData collection
    }
    },{
        collection: 'organizationData',
        timestamps: true 
}); 

//collection for eventData
let eventDataSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    eventID: {
        type: String,
        require: true,
        unique: true
    },
    clientID: {
        type: String
    },
    eventName: {
        type: String,
        require: true
    },
    organizations: {
        type: [String] // references organizationID in organizationData collection
    },
    services: {
        type: [String] // references serviceID in serviceData collection
    },
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
    attendees: {
        type: [String] // references clientID in primaryData collection
    }
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
