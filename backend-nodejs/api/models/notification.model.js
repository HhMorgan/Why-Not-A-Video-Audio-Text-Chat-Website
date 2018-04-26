var mongoose = require('mongoose');
var requestSchema = mongoose.Schema( {
  sender: {                                 
    type: String,
    required: true,
    lowercase: true,
  },
  recipient: {                    
    type: String,
    required: true,
  },
  status: {                               
    type :String,
    default : 'pending'
  },
  type: {                                
    type: String,
    required :true
  },  createdAt: {                          
    type: Date,
    default: Date.now,
  }
  
},{ collection: 'Notification' } );

mongoose.model('Notification', notificationSchema);