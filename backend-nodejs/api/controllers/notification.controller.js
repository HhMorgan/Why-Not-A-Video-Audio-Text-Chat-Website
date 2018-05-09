var mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  Validations = require('../utils/validations'),
  Notification = mongoose.model('Notification');

module.exports.getNotifications = function (req, res, next) {
  Notification.find( { recipient : { $eq : req.decodedToken.user._id  } } ).populate('recipient','username').populate('sender','username img').exec(function (err, notifications) {
    if (err) {
      return next(err);
    }
    if(notifications.length != 0 ){
      return res.status(200).json({
        err: null,
        msg: 'Notifications retrieved successfully.',
        data: notifications
      });
    } else {
      return res.status(404).json({
        err: null,
        msg: 'No Notifications Found For You',
        data: notifications
      });
    }
  });
};

module.exports.getUnreadNotifications = function (req, res, next) {
  Notification.find( { recipient : { $eq : req.decodedToken.user._id } , read : false }).exec(function (err, notifications) {
    if (err) {
      return next(err);
    }
    if(notifications.length != 0){
      return res.status(200).json({
        err: null,
        msg: 'Notifications retrieved successfully.',
        data: notifications.length
      });
    } else {
      return res.status(404).json({
        err: null,
        msg: 'No UNotifications Found For You',
        data: 0
      });
    }
  });
};

module.exports.markNotificationAsRead = function(req , res , next){
  var valid = req.params.notificationID && Validations.isObjectId(req.params.notificationID)
  if(!valid){
    return res.status(422).json({
      err: null,
      msg: 'notificationID is Not Valid',
      data: null
    });
  } else {
    Notification.findOneAndRemove( { _id : req.params.notificationID , 
      recipient : req.decodedToken.user._id } , 
      { $set : { read : true  } }  ).populate('sender recipient','username').exec(function(err , notification){
      if(err){
        return next(err);
      } else {
        if(notification){
          return res.status(200).json({
            err: null,
            msg: 'Notification Marked As Read.',
            data: notification
          })
        } else {
          return res.status(404).json({
            err: null,
            msg: 'Notifications retrieved successfully.',
            data: notifications.length
          })
        }
      }
    })
  }
}

module.exports.deleteNotification = function(req , res , next){
  var valid = req.params.notificationID && Validations.isObjectId(req.params.notificationID)
  if(!valid){
    return res.status(422).json({
      err: null,
      msg: 'notificationID is Not Valid',
      data: null
    });
  } else {
    Notification.findOneAndRemove({ _id : req.params.notificationID , 
      recipient : req.decodedToken.user._id },function( err , notification ){
      if(notification){
        return res.status(404).json({
          err: null,
          msg: 'Notification Deleted',
          data: notification
        })
      } else {
        return res.status(404).json({
          err: null,
          msg: 'Notification Not Found',
          data: null
        })
      }
    })
  }
}

module.exports.AddNotification = function (req, res, next) {
  var valid =
    req.body.reciever &&
    Validations.isString(req.body.reciever);
  // check if the tag name is given    
  if (!valid) {
    return res.status(422).json({
      err: null,
      msg: 'reciever (String) is a required fields.',
      data: null
    });
  }
  // Security Check

  delete req.body.createdAt;
  Notification.create(req.body, function (err, Notification) {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      err: null,
      msg: 'Notification was sent Sucessfully.',
      data: Notification
    });
  });
};

module.exports.createNotificationMuitiple = function( sender , recipients , message , type , i , done ) {
  if(i == recipients.length){
    return done(true);
  } else {
    Notification.create( { sender : sender , recipient : recipients[i]._id , 
      message : message , type :type } , function ( err , notification ) {
        return module.exports.createNotificationMuitiple( sender , recipients , message , type , i + 1 , done )
    })
  }
}

module.exports.createNotification = function ( sender , recipient , message , type , done ) {
  Notification.create( { sender : sender , recipient : recipient , message : message , type :type } , function ( err , notification ) {
    if(notification)
      return done(true);
    else
      return done(false);
  })
}