var mongoose = require('mongoose');
var sessionSchema = mongoose.Schema({

    createdById: {
        type: mongoose.Schema.Types.ObjectId ,
        ref: 'User',
        required: true
    },
    users : [{ type: mongoose.Schema.Types.ObjectId , ref: 'User' , _id : false }],
},{ collection: 'Sessions'} );

mongoose.model('Session', sessionSchema);