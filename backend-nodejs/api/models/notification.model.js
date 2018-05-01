var mongoose = require('mongoose');
var NotificationSchema = mongoose.Schema( {
  sender: {                                 
    type: mongoose.Schema.Types.ObjectId , ref: 'User',
    required: true,
  },
  recipient: {                    
    type: mongoose.Schema.Types.ObjectId , ref: 'User',
    required: true,
  },
  message : {
    type : String,
    required : true
  },
  read: {                               
    type : Boolean,
    default : false
  },
  type: {                                
    type: String,
    required :true
  },
  createdAt: {                          
    type: Date,
    default: Date.now,
  }
},{ collection: 'Notifications' } );

mongoose.model('Notification', NotificationSchema);