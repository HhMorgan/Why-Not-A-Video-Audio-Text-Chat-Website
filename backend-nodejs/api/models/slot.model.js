var mongoose = require('mongoose');
var slotSchema = mongoose.Schema({
  expert: {
<<<<<<< HEAD
   type:String
  },
  
=======
    type:String
  },
  user:{
    type:String
 },
>>>>>>> d129746a87d0f12a159be6e5217b7dbbf7b238c1
  slotDate1: {
    type :String,
    required: true
  },
  
  slotTime1: {
      type: String
  },
  
  slotDate2: {
    type :String,
    required: false
  },
  
  slotTime2: {
      type: String
  },
  
  slotDate3: {
    type :String,
    required: false
  },
  
  slotTime3: {
      type: String
  },
  
},{ collection: 'ReservedSlots' }
);


mongoose.model('ReservedSlot', slotSchema);