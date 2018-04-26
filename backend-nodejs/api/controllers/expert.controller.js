/* The  controller that handles all the functionality that an expert can do.
An expert can view the his/her pending slot requests created by another user --> "viewSlotRequests".
An expert can accept/reject a slot request --> "editSlotRequest".
*/
var mongoose = require('mongoose'),
  Request = mongoose.model('Request'),
  User = mongoose.model('User'),
  Tag = mongoose.model('Tag'),
  Slot = mongoose.model('ReservedSlot'),
  Schedule = mongoose.model('Schedule'),
  Validations = require('../utils/validations'),
  moment = require('moment');


//This function is responsible for adding a speciality for the expert,only if it exists in the tag table
module.exports.addSpeciality = function(req, res, next) {
  var valid = req.body.speciality && Validations.isString(req.body.speciality);
  if(!valid){
    return res.status(422).json({
      err: null,
      msg: 'Speciality: '+req.body.speciality+' is not a string/is not valid.',
      data: null
      });
    } 
    //will be added when integrated with Tags
    Tag.findOne({
      name : { $eq : req.body.speciality } , 
      status : { $eq : 'Accepted' } , 
      blocked : { $eq : false}
    },function(err,tag){
      if (err){
        return next(err);
      }
      if (!tag) {
        return res.status(404).json({ 
           err: null, 
           msg:  'This Tag is not found or is blocked. + Please request this tag first then add it as speciality',
           data: null 
          });
      }
      //need to check on role first before adding the speciality
      // If Tag was found in tag table then add it in user table
      User.findOneAndUpdate({ 
        // email : {$eq: req.body.email } , 
        _id : { $eq : req.decodedToken.user._id} , role :{$eq: 'expert'},
        speciality: { $ne: tag._id }
      },{ $push: { speciality: tag._id } }, { new : true } , function (err, updateduser) {
          if (err) {
            return next(err);
          }
          if (!updateduser) {
            return res.status(404).json({ 
              err: null , 
              msg: 'Speciality could not be added either it already exists or u are not an expert or a user', 
              data: null 
            });
          }
      return res.status(201).json({
        err: null,
        msg: 'Speciality added',
        data: updateduser.speciality
      });
    });
  });
};

module.exports.editSpeciality= function(req, res, next) {
  Tag.findOne({
    name : { $eq : req.body.speciality } , 
    status : { $eq : 'Accepted' } , 
    blocked : { $eq : false}
  },function(err,tag){
    if (err){
      return next(err);
    }
    if (!tag) {
      return res.status(404).json({ 
         err: null, 
         msg:  'This Tag is not found or is blocked. + Please request this tag first then add it as speciality',
         data: null 
        });
    }
    User.findOneAndUpdate({
      _id : { $eq : req.decodedToken.user._id} , role :{$eq: 'expert'},
      speciality: { $eq: tag._id }
    },{ $pull: { speciality: tag._id } }, { new : true } , function (err, updateduser) {
      if (err) {
        return next(err);
      }
      if (!updateduser) {
        return res.status(404).json({ 
          err: null , 
          msg: 'Speciality could not be removed u are not an expert or a user', 
          data: null 
        });
      }
      return res.status(201).json({
        err: null,
        msg: 'Speciality removed',
        data: updateduser.speciality
      });
    });
  }); 
};
 
module.exports.editSlotRequest =function(req, res, next) {
   // checks first that requestId is valid
  if (!Validations.isObjectId(req.params.requestId)) {
    return res.status(422).json({
      err: null,
      msg: 'requestId parameter must be a valid ObjectId.',
      data: null
    });
  }
  delete req.body.createdAt;
  //finds and updates the request
  Request.findByIdAndUpdate(
    req.params.requestId,
    { $set: req.body } , { new: true } ).exec(function(err, updatedRequest) {
    if (err) {
      return next(err);
    }
    if (!updatedRequest) {
      return res.status(404).json({
        err: null,
        msg: 'Request not found.', 
        data: null 
      });
    }
    return res.status(200).json({
      err: null,
      msg: 'Request was updated successfully.',
      data: updatedRequest
    });
  });
};

module.exports.viewRequestedSlots = function(req, res, next) {
  // Finds authenticated user info 
  User.findById('5ad92a3eb1e18d0564773622').exec(function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(404).json({ err: null, msg: 'User not found.', data: null });
    }
    // Retrieves email of the logged in expert 
    var email = user.email;
    /* Requests is found by matching recipient to the expert's email, status should be
       pending and type is slotRequest.
     */
    Schedule.find({
      expertID: user._id,
      //condition to display records with requested users only
       $expr : { $gt:[ {$size : "$slots.usersRequested"} , 1 ] } 
       
    }).exec(function(err, slots) {
      if (err) {
        return next(err);
      }
      res.status(200).json({
        err: null,
        msg:' Requested slots by users retrieved successfully.',
        data: slots
      });
    });
  });
}
  module.exports.viewScheduledSlots = function(req, res, next) {
    // Finds authenticated user info 
    User.findById(req.decodedToken.user._id).exec(function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(404).json({ err: null, msg: 'User not found.', data: null });
      }
      // Retrieves email of the logged in expert 
      var email = user.email;
      /* Requests is found by matching recipient to the expert's email, status should be
         pending and type is slotRequest.
       */
      Schedule.find({
        expertID: user._id,
        //condition to display records with requested users only
         $expr : { $gt:[{$size : "$slots.usersAccepted"} , 1 ] }  
        
      }).exec(function(err, slots) {
        if (err) {
          return next(err);
        }
        res.status(200).json({
          err: null,
          msg:' Requested slots by users retrieved successfully.',
          data: slots
        });
      });
    });
  };

  



module.exports.chooseSlot = function(req,res,next){
  console.log(req.body);
  if(req.body==null){
    return res.status(422).json({
      err: null,
      msg: 'date is required',
      data: null
    });
  } else {
    req.body.expert = "boudi";
    Slot.create(req.body,function(err,chosenSlot){
      res.status(201).json({
        err: null,
        msg: 'Slot chosen',
        data: chosenSlot
      });
    });
  }
};



module.exports.viewSchedule = function(req, res, next) {
  // Finds authenticated user info 
  User.findById('5ad5bee364a0b6360cee111b').exec(function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(404).json({ err: null, msg: 'User not found.', data: null });
    }
 
    Schedule.findOne({
      expertID: user._id,
    
    }).exec(function(err, slots) {
      if (err) {
        return next(err);
      }
    
      res.status(200).json({
        err: null,
        msg:' slots defined by expert retrieved successfully.',
        data: slots
      });
    });
  });
};


module.exports.createSchedule = function(req, res, next) {
  // Check that the body keys are in the expected format and the required fields are there
  
  Schedule.find( req.decodedToken.user._id ).exec(function(err,schedule){
    if (!schedule){
      req.body.expertID = req.decodedToken.user._id ;
       req.body.slots =  {Date: req.body.Date} ; 
        Schedule.create( req.body , function(err,slots) {
        if(err)
        return next(err);
        return res.status(200).json({
         err: null ,
         msg: 'Adding slot to a new created Schedule Completed Successfully' ,
         data: slots
        });    
        });}
    else{ 
      Schedule.findOneAndUpdate(  
        { expertID : { $eq : req.decodedToken.user._id } }  ,  

       { $push: { slots :{ Date : req.body.Date } } } , {new: true}
    ).exec(function(err, schedule) {
      
        if (err) 
            return next(err);
        if(schedule) {
            return res.status(201).json({
                err: null ,
                msg: 'Adding slot to Schedule Completed Successfully' ,
                data: schedule
            });
        } else {
            return res.status(409).json({
                err: null ,
                msg: 'Adding slot to Schedule Failed' ,
                data: null
            });
             }
    });}   });

};

module.exports.acceptRequest =  function(req, res, next) {
  Schedule.findOneAndUpdate(  
    {$and:[{ expertID : req.decodedToken.user._id }  , 
    { 'slots.Date' : req.body.Date  }]},
    {$push: {'slots.$.usersAccepted': req.body.userName }},{new:true}
  ).exec(function(err, schedule) {
  
    if (err) 
        return next(err);
    if(schedule) {
      console.log(schedule.slots[0].usersAccepted);

      for(var i = 0; i < schedule.slots.length;i++){
        for(var j = 0; j < schedule.slots[i].usersRequested.length;j++){
        console.log(schedule.slots[i].usersRequested[j]);
        }
        }
    
          return res.status(200).json({
            err: null ,
            msg: 'Adding slot to Schedule Completed Successfully' ,
            data: schedule
        });
        
    } else {
        return res.status(409).json({
            err: null ,
            msg: 'Adding slot to Schedule Failed' ,
            data: null
        });
         }
});

};




module.exports.rejectRequest = function(req, res, next) {

  if (!Validations.isObjectId(req.body.userID)) {
    return res.status(422).json({
      err: null,
      msg: 'The userID entered is not valid',
      data: null
      });
    }

    User.findById(req.body.userID).exec(function(err, user) {
  
      if (err) 
          return next(err);
      //Add notfication that he got rejected


      //remove from usersRequested array
      Schedule.findOne(  
        {$and:[{ expertID : req.decodedToken.user._id }  , 
        { 'slots.Date' : req.body.Date  },
        {'slots.usersRequested': req.body.userID}]}
      ).exec(function(err, schedule) {
      
        if (err) 
            return next(err);
        if(schedule) {
          Schedule.findOneAndUpdate(  
            {$and:[{ expertID : req.decodedToken.user._id }  , 
            { 'slots.Date' : req.body.Date  }]},
            {$pull: {'slots.$.usersRequested': req.body.userID }},{new:true}
          ).exec(function(err, schedule) {
          
            if (err) 
                return next(err);
                console.log(schedule);
            if(schedule) {
            
                  return res.status(200).json({
                    err: null ,
                    msg: user.email+' got rejected Successfully' ,
                    data: schedule
                });
                
            } else {
                return res.status(409).json({
                    err: null ,
                    msg: 'Failed to remove user.' ,
                    data: null
                });
                 }
        });
        } else {
            return res.status(409).json({
                err: null ,
                msg: 'Record not found.' ,
                data: null
            });
             }
        });
    });

};

module.exports.rejectAllRequests = function(req, res, next) {

  Schedule.findOne({$and:[{ expertID : req.decodedToken.user._id }  , 
    { 'slots.Date' : req.body.Date  }]}, ).exec(function(err, schedule) {
  
      if (err) 
          return next(err);
      if(schedule) {
        var schedule1 = schedule ;
        for(var i = 0; i < schedule.slots.length;i++){
          for(var j = 0; j < schedule.slots[i].usersAccepted.length;j++){
            req.body.userID =  schedule.slots[i].usersAccepted[j];
            Schedule.findOneAndUpdate(  
              {$and:[{ expertID : req.decodedToken.user._id }  , 
              { 'slots.Date' : req.body.Date  }]},
              {$pull: {'slots.$.usersAccepted': req.body.userID }},{new:true}
            ).exec(function(err, schedule2) {
            
              if (err) 
                  return next(err);
              schedule1 = schedule2;
            });
          }
          }
      
            return res.status(200).json({
              err: null ,
              msg: 'Adding slot to Schedule Completed Successfully' ,
              data: schedule1
          });
          
      }
    });
};