var mongoose = require('mongoose');
var slotsSchema = mongoose.Schema({
    
    expertEmail: {
        type: String ,
      
        required: true
    },
  // Date: String,
    
    
    slots: [ new mongoose.Schema(
        {
            Date:{ type:String, required:true},
            sessionId: { type: mongoose.Schema.Types.ObjectId , ref: 'Session'} ,
            usersAccepted:{ type: [String] } ,
            usersRequested:{ type: [String] } } , { _id: false })],

},{ collection: 'Schedule'} ) ;

mongoose.model('Schedule', slotsSchema);