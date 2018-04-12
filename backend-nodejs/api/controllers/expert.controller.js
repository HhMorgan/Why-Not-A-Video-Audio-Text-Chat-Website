var mongoose = require('mongoose'),
  Slot = mongoose.model('ReservedSlot'),
  moment = require('moment');




  module.exports.chooseSlot = function(req,res,next){
    console.log(req.body);
    if(req.body==null){
      return res.status(422).json({
        err: null,
        msg: 'date is required',
        data: null
    });
  }else{
    req.body.expert = "boudi";
    Slot.create(req.body,function(err,chosenSlot){
      res.status(201).json({
        err: null,
        msg: 'Slot chosen',
        data: chosenSlot
      });
    });
    
  }
}
  
  
