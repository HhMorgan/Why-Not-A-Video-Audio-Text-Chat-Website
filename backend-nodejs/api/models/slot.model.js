var mongoose = require('mongoose');
var slotSchema = mongoose.Schema({
  expert: {
   type:String
  },
  
  slotDate1: {
    type :String,
    required: true
  },
  
  slotTime1: {
      type: String
  },
  
  slotDate2: {
    type :String,
    required: true
  },
  
  slotTime2: {
      type: String
  },
  
  slotDate3: {
    type :String,
    required: true
  },
  
  slotTime3: {
      type: String
  },
  
},{ collection: 'ReservedSlots' }
);


mongoose.model('ReservedSlot', slotSchema);