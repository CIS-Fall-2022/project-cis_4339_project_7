
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

module.exports = mongoose.model(serviceDataSchema)
