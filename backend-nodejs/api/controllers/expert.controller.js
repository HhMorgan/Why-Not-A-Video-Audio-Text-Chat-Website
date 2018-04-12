/* The  controller that handles all the functionality that an expert can do.
An expert can view the his/her pending slot requests created by another user --> "viewSlotRequests".
An expert can accept/reject a slot request --> "editSlotRequest".
*/
var mongoose = require('mongoose'),
  Request = mongoose.model('Request'),
  Validations = require('../utils/Validations'),
  User = mongoose.model('User'),
  Slot = mongoose.model('ReservedSlot'),
  moment = require('moment');


  module.exports.viewSLotRequests = function(req, res, next) {
    // Finds authenticated user info 
    User.findById(req.decodedToken.user._id).exec(function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res
          .status(404)
          .json({ err: null, msg: 'User not found.', data: null });
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
      {
        $set: req.body
      },
      { new: true }
    ).exec(function(err, updatedRequest) {
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
      res.status(200).json({
        err: null,
        msg: 'Request was updated successfully.',
        data: updatedRequest
      });
    });
  };
  
  /*module.exports.getUserData = function(req, res, next) {
    User.findById(req.decodedToken.user._id).exec(function(err, user) {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res
            .status(404)
            .json({ err: null, msg: 'User not found.', data: null });
        }
        res.status(200).json({
            err: null,
            msg: 'user retrieved successfully.',
            data: user});})}
            
    

            */


  

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
  
  
