const uuid = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;



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


const organizationdata = mongoose.model('organizationData', organizationDataSchema);


module.exports = { organizationdata }