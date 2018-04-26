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
  Session = mongoose.model('Session'),
  Validations = require('../utils/validations'),
  moment = require('moment');
  var nodemailer = require('nodemailer');
// authenticating sender email
var transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: 'riseuptest@hotmail.com',
    pass: 'Test123456789'
  }
});


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
    Schedule.aggregate([
      { $match : { "expertEmail" : email } },
        {$addFields : {"slots":{$filter:{ // We override the existing field!
        input: "$slots",
        as: "slots",
        cond: { $gt:[ {$size : "$$slots.usersRequested"} , 0 ] } 
      }}}}
    ]).exec(function(err, slots) {
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
      
      Schedule.aggregate([
        { $match : { "expertEmail" : email } },
        	{$addFields : {"slots":{$filter:{ // We override the existing field!
          input: "$slots",
          as: "slots",
          cond: { $gt:[ {$size : "$$slots.usersAccepted"} , 0 ] } 
        }}}}
      ]).exec(function(err, slots) {
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
  User.findById(req.decodedToken.user._id).exec(function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(404).json({ err: null, msg: 'User not found.', data: null });
    }
 
    Schedule.findOne({
      expertEmail: user.email,
    
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
  

   // User.findById('5ae08b74a843343a90abbf3c').exec(function(err, user) {
     User.findById(req.decodedToken.user._id).exec(function(err, user) {
          if (err) 
              return next(err);
          if(user){
              req.body.expertID = user._id;
              var email = user.email;
              

              Schedule.findOne(  { expertEmail : { $eq : email } }  ).exec(function(err,schedule){

                if (!schedule){

                
                  req.body.expertEmail=email;
                  req.body.slots =  {Date: req.body.Date} ; 
                 
                  Schedule.create( req.body , function(err,slots) {
                    if(err)
                        return next(err);
                    return res.status(201).json({
                      err: null ,
                       msg: 'Adding slot to a new created Schedule Completed Successfully' ,
                       data: slots
                      });    
                
                });
  
              }

                 else{
                   
                
      Schedule.findOneAndUpdate(  
        { expertEmail : { $eq :email } }  ,  

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
  }
        //if not a user
        else {
              return res.status(404).json({
                  err: null,
                  msg: 'Unable to locate userWithId :' + req.body.userId,
                  data: null
              });
  }  
  
});
};




module.exports.acceptRequest =  function(req, res, next) {


  Schedule.findOne({ expertEmail : req.decodedToken.user.email , 
    "slots.Date":req.body.Date} ,
    {"slots.$": 1} ).exec(function(err, schedule) {
  
      if (err) 
          return next(err);
      if(schedule.slots[0].usersAccepted.length >0){
        return res.status(409).json({
          err: null ,
          msg: 'This slot is already assigned to another user.' ,
          data: null
      });
      }


  User.findOne({email:req.body.userName}).exec(function(err, user) {
  
  if (err) 
  return next(err);
  if(!user){
    return res.status(409).json({
      err: null ,
      msg: 'Failed to find a user with this email.',
      data: null
  });
  }
  req.body.createdById=req.decodedToken.user._id;
  req.body.candidates =  {id: user._id} ; 
 Session.create(req.body, function(err,Session) {
      if(err)
      return next(err);

      if(!Session){
        return res.status(409).json({
          err: null ,
          msg: 'Failed to create a session.',
          data: null
      });

      }
    Schedule.findOneAndUpdate(  
    {$and:[{ expertEmail : req.decodedToken.user.email}  , 
    { 'slots.Date' : req.body.Date  }]},
    {$push: {'slots.$.usersAccepted': req.body.userName},
    $set :{'slots.$.sessionId':Session._id},
     $pull: {'slots.$.usersRequested':req.body.userName} }  ,{new:true}
  ).exec(function(err, schedule) {
    if (err) 
        return next(err);
    if(schedule) {
          //send confirmation email
          let confirmationUrl = 'http://localhost:4200/#/page' + `/session/${Session._id}`;
          var expert = req.decodedToken.user.email;
           //contents of email
           var mailOptions = {
             from: 'riseuptest@hotmail.com',
             to: user.email, expert,
             subject: 'Session Confirmation',
             html: 'This is a confirmation email to confirm you session reservation.</p>'+'Expert : '+ expert+ 
             '</p> User : ' + user.email + '</p> Session url : ' + confirmationUrl + "</p> Timing : " + req.body.Date , 
            };
            /*transporter.sendMail(mailOptions, function (err) {
              if (err) {
                  }
          });*/
             module.exports.rejectAllRequests(req,res,next);
            
           
    
          
    } else {
        return res.status(409).json({
            err: null ,
            msg: 'Failed to accept the slot reservation.',
            data: null
        });
         }
});
   
    });
  });
});

};




module.exports.rejectRequest = function(req, res, next) {

    User.find({email:req.body.userEmail}).exec(function(err, requestingUser) {
  
      if (err) 
          return next(err);
      //Add notfication that he got rejected


      //remove from usersRequested array
          Schedule.findOneAndUpdate(  
            {$and:[{ expertEmail : req.decodedToken.user.email }  , 
            { 'slots.Date' : req.body.Date  }]},
            {$pull: {'slots.$.usersRequested': req.body.userEmail }},{new:true}
          ).exec(function(err, schedule) {
          
            if (err) 
                return next(err);
            if(schedule) {
              Schedule.aggregate([
                { $match : { "expertEmail" : req.decodedToken.user.email } },
                  {$addFields : {"slots":{$filter:{ // We override the existing field!
                  input: "$slots",
                  as: "slots",
                  cond: { $gt:[ {$size : "$$slots.usersRequested"} , 0 ] } 
                }}}}
              ]).exec(function(err, newschedule) {
      
                  if (err) 
                      return next(err);
                return res.status(200).json({
                  err: null ,
                  msg: req.body.userEmail+' got rejected Successfully' ,
                  data: newschedule
              });
            });
            
                
            } else {
                return res.status(409).json({
                    err: null ,
                    msg: 'Failed to remove user.' ,
                    data: null
                });
                 }
        });
        
    });

};

module.exports.rejectAllRequests = function(req, res, next) {

  Schedule.findOne({ expertEmail : req.decodedToken.user.email , 
    "slots.Date":req.body.Date} ,
    {"slots.$": 1} ).exec(function(err, schedule) {
  
      if (err) 
          return next(err);
      if(schedule) {
          for(var j = 0; j < schedule.slots[0].usersRequested.length;j++){
           //console.log(schedule.slots[0].usersRequested.length);
            req.body.userEmail =  schedule.slots[0].usersRequested[j];
            Schedule.findOneAndUpdate(  
              {$and:[{ expertEmail : req.decodedToken.user.email}  , 
              { 'slots.Date' : req.body.Date  }]},
              {$pull: {'slots.$.usersRequested': req.body.userEmail }},{new:true}
            ).exec(function(err, schedule2) {
            
              if (err) 
                  return next(err);

                  //Add notfication to user rejected
            });
          }
          
          Schedule.aggregate([
            { $match : { "expertEmail" : req.decodedToken.user.email } },
              {$addFields : {"slots":{$filter:{ // We override the existing field!
              input: "$slots",
              as: "slots",
              cond: { $gt:[ {$size : "$$slots.usersRequested"} , 0 ] } 
            }}}}
          ]).exec(function(err, newschedule) {
  
              if (err) 
                  return next(err);
            return res.status(200).json({
              err: null ,
              msg: 'Successfully accepted slot reservation.' ,
              data: newschedule
          });
        });
          
      }
    });
};