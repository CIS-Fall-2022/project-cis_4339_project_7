const uuid = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


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


const eventdata = mongoose.model('eventData', eventDataSchema);

module.exports = { eventdata }