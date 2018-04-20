/* The  controller that handles all the functionality that an expert can do.
An expert can view the his/her pending slot requests created by another user --> "viewSlotRequests".
An expert can accept/reject a slot request --> "editSlotRequest".
*/var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose'),
  Request = mongoose.model('Request'),
  User = mongoose.model('User'),
  Tag = mongoose.model('Tag'),
  Slot = mongoose.model('ReservedSlot'),
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


module.exports.findTagbyid = function(req, res, next) {
  Tag.findOne({ _id: new ObjectId(req.params.TagId+"") }
   
  ).exec(function(err,tag){
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

    return res.status(201).json({ 
      err: null, 
      msg:  'Succesfully retrieved the Tag',
      data: tag 
     });


  
})
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

module.exports.viewSLotRequests = function(req, res, next) {
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
    Request.find({
      status: "pending",
      recipient: email,
      type: "slotRequest"
    }).exec(function(err, requests) {
      if (err) {
        return next(err);
      }
      res.status(200).json({
        err: null,
        msg:' Pending requests count retrieved successfully.',
        data: requests
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
