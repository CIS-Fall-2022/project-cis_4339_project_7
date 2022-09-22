
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

module.exports = mongoose.model(organizationDataSchema)
