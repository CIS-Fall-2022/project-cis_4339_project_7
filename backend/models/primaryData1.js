const uuid = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


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


const primarydata = mongoose.model('primaryData', primaryDataSchema);


module.exports = { primarydata }