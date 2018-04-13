/*This model is used to create request schema, a request can be either slot request or upgrade request.
A slot request is created by a user in case of wanting to book a session with an expert.
An upgrade request is created by user in case of wanting to beacome an expert. 
Schema consists of: 
   sender ----->  user email who created the request.
   recipient -->  user email that will recieve the request (expert or admin).
   status ----->  request status {pending,accepted,rejected}.
   createdAt -->  creation time of the request.
   viewed ----->  shows whether request was viewed by recipient or not.
   type ------->  type of request {slot request,upgrade request}.
*/ 
var mongoose = require('mongoose');
var requestSchema = mongoose.Schema({
  
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
  
  createdAt: {                          
    type: Date,
    default: Date.now,
  },
  
  viewed: {                             
    type: Boolean,
    default : 'false'
  },
  
  type: {                                
    type: String,
    required :true
  }
  
},{collection: 'Requests'}
);


mongoose.model('Request', requestSchema);