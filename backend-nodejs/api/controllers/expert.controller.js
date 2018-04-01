var mongoose = require('mongoose'),
  Request = mongoose.model('Request'),
  User = mongoose.model('User'),
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
  module.exports.addSpeciality = function(req, res, next) {
    var valid = req.body.speciality&&Validations.isString(req.body.speciality);
    if(!valid){
      return res.status(422).json({
        err: null,
        msg:
          'The speciality entered is not a string/is not valid.',
        data: null
      });
    } //need to check on role first before adding the speciality
    User.findOneAndUpdate({email:{$eq: req.body.email}},//decodedToken.user._id
     {
       $push: 
    { speciality: req.body.speciality } 
     },{new:true} //to pass the updated user
     ,function (err, updateduser) {
      if (err){
        return next(err);
      }
      if (!updateduser) {
        return res
          .status(404)
          .json({ err: null, msg: 'Speciality could not be added', data: null });
      }
      res.status(200).json({
        err: null,
        msg: 'Speciality added',
        data: updateduser
      });
    });
  };