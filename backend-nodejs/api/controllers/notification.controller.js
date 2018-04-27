var mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  Validations = require('../utils/validations'),
 Notification = mongoose.model('notification');

 module.exports.getNotifications = function(req, res, next) {
  Notification.find({}).exec(function(err, Notification) {
    if (err) {
      return next(err);
    }
    res.status(200).json({
      err: null,
      msg: 'Notifications retrieved successfully.',
      data: Notification
    });
  });
};

module.exports.AddNotification = function(req, res, next) {
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
//delete req.body.createdAt;
//delete req.body.updatedAt;
// the method below creates the requred Tag in the backend and returns 201 if successful
Notification.create(req.body, function(err, Notification) {
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