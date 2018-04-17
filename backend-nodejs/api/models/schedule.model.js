var mongoose = require('mongoose');
var slotsSchema = mongoose.Schema({
    
    expertID: {
        type: mongoose.Schema.Types.ObjectId ,
        ref: 'User',
        required: true
    },
  // Date: String,
    
    
    slots: [ new mongoose.Schema(
        {
            Date:{  type:String, required:true},
         sessionId: { type: mongoose.Schema.Types.ObjectId , ref: 'Session' } 
     , usersAccepted:{ type: [mongoose.Schema.Types.ObjectId] , ref: 'User'} ,
      usersRequested:{ type: [mongoose.Schema.Types.ObjectId] , ref: 'User'} } , { _id: false })],

},{ collection: 'Schedule'} );

mongoose.model('Schedule', slotsSchema);