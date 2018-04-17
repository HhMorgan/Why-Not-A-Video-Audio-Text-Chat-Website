var mongoose = require('mongoose');
var sessionSchema = mongoose.Schema({
    
    createdById: {
        type: mongoose.Schema.Types.ObjectId ,
        ref: 'User',
        required: true
    },
    
    candidates: [ new mongoose.Schema({ id: { type: mongoose.Schema.Types.ObjectId , ref: 'User' } , 
    rtcDes:{type: String} } , { _id: false })],

},{ collection: 'Sessions'} );

mongoose.model('Session', sessionSchema);