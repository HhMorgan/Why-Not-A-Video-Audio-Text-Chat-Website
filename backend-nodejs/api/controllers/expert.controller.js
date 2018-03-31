var mongoose = require('mongoose'),
  Request = mongoose.model('Request'),
  User = mongoose.model('User');


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
          msg:' Pending requests count retrieved successfully.',
          data: requests
        });
      });
    });
    
  };

  module.exports.viewRequests = function(req, res, next) {
    Request.find({
      status: "pending",
      //expert: email
    }).exec(function(err, requests) {
      if (err) {
        return next(err);
      }
      res.status(200).json({
        err: null,
        msg:' Pending requests retrieved successfully.',
        data: requests
      });
    });
  };
  
