var mongoose = require('mongoose'),
  Request = mongoose.model('Request'),
  User = mongoose.model('User'),
  Tag = mongoose.model('Tags'),
  Validations = require('../utils/validations'),
  moment = require('moment');


  module.exports.getRequestsCount = function(req, res, next) {
    User.findById(req.decodedToken.user._id).exec(function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res
          .status(404)
          .json({ err: null, msg: 'User not found.', data: null });
      }
      var email = user.email;
      
      Request.find({
        status: "pending",
        expert: email
      }).exec(function(err, requests) {
        if (err) {
          return next(err);
        }
        res.status(200).json({
          err: null,
          msg:' Pending requests count retrieved successfully.'+requests.length,
          data: requests
        });
      });
    });
    
  };

  module.exports.viewRequests = function(req, res, next) {
    Request.find({}).exec(function(err, request) {
      if (err) {
        return next(err);
      }
      res.status(200).json({
        err: null,
        msg:' Pending requests retrieved successfully.',
        data: request
      });
    });
  };
  //This function is responsible for adding a speciality for the expert,only if it exists in the tag table
  module.exports.addSpeciality = function(req, res, next) {
    var valid = req.body.speciality&&Validations.isString(req.body.speciality);
    if(!valid){
      return res.status(422).json({
        err: null,
        msg:
        'Speciality:'+req.body.speciality+'/The speciality entered is not a string/is not valid.',
        data: null
      });
    } 
    //will be added when integrated with Tags
    Tag.findOne({name:{$eq:req.body.speciality},status:{$eq:'Accepted'},blocked:{$eq:false}},
    function(err,tag){
      if (err){
        return next(err);
      }
      if (!tag) {
        return res.status(404).json({ 
           err: null, 
           msg: 
              'This Tag is not found or is blocked.'+
              'Please request this tag first then add it as speciality',
           data: null });
      }
      //need to check on role first before adding the speciality
      // If Tag was found in tag table then add it in user table
      User.findOneAndUpdate({email:{$eq: req.body.email},
       //id:{$eq:decodedToken.user._id},
       role :{$eq: 'expert'},
       speciality: { $ne: req.body.speciality }//to be changed to tag._id
       },
     {
       $push: 
    { speciality: req.body.speciality } //to be changed to tag._id
     },{new:true} //to pass the updated user
     ,function (err, updateduser) {
      if (err){
        return next(err);
      }
      if (!updateduser) {
        return res.status(404).json({ 
          err: null, 
          msg: 
          'Speciality could not be added;'+
          'either it already exists or u are not an expert or a user', 
          data: null });
      }
      res.status(200).json({
        err: null,
        msg: 'Speciality added',
        data: updateduser
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
  
  
