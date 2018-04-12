var mongoose = require('mongoose'),
moment = require('moment'),
jwt = require('jsonwebtoken'),
Validations = require('../utils/Validations'),
Encryption = require('../utils/encryption'),
EMAIL_REGEX = require('../config/appconfig').EMAIL_REGEX,
User = mongoose.model('User');
moment = require('moment');

module.exports.updateEmail = function(req, res, next) {
  if (!Validations.matchesRegex(req.body.email, EMAIL_REGEX)) {
    return res.status(422).json({
      err: null,
      msg: 'Email must be in correct format.',
      data: null
    });
  }

  delete req.body.updatedAt;
  req.body.updatedAt = moment().toDate();

    User.findById(req.decodedToken.user._id).exec(function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(404).json({ err: null, msg: 'User not found.', data: null });
    }

    //exec method returns the matched text if it finds a match, otherwise it returns null.

    User.findOne({ email: req.body.email.trim().toLowerCase()}).exec(function(err, updatedUser) {
  // If an err occurred, call the next middleware in the app.js which is the error handler
  if (err) {
    return next(err);
  }
  // If there is a user with this email don't continue
  if (updatedUser) {
    return res.status(422).json({
      err: null,
      msg:'A user with this email address already exists, please try another email address.',
      data: null
    });
  }

 User.findByIdAndUpdate(req.decodedToken.user._id,{$set: req.body},{ new: true }).exec (function(err, updatedUser) {
      if (err) {
        return next(err);
      }
      res.status(201).json({
        err: null,
        msg: 'Email updated successfully.',
        data: updatedUser
      });
    });
  });
});
}

module.exports.updatePassword = function(req, res, next) {

    var valid =
   req.body.password &&     //enno dakhalhom
    Validations.isString(req.body.password) &&
    req.body.confirmPassword &&
    Validations.isString(req.body.confirmPassword);

  if (!valid) {
    return res.status(422).json({
      err: null,
      msg: 'password(String) and confirmPassword(String) are required fields.',
      data: null
    });
  }

  var password = req.body.password.trim();

  if (password.length < 8) {
    return res.status(422).json({
      err: null,
      msg: 'Password must be of length 8 characters or more.',
      data: null
    });
  }

  if (password !== req.body.confirmPassword.trim()) {
    return res.status(422).json({
      err: null,
      msg: 'password and confirmPassword does not match.',
      data: null
    });
  }

  delete req.body.updatedAt;

  Encryption.hashPassword(password, function(err, hash) {
    if (err) {
      return next(err);
    }
    req.body.password = hash;
    User.findByIdAndUpdate(req.decodedToken.user._id,{$set: req.body},{ new: true }).exec (function(err, updatedUser) {
      if (err) {
        return next(err);
      }
      res.status(201).json({
        err: null,
        msg: 'Password updated successfully.',
        data: updatedUser
      });
    });
  });
  

}

module.exports.updateDescription = function(req, res, next) {
 if (!(Validations.isString(req.body.description))){
  return res.status(422).json({
    err: null,
    msg:'Description must be of String format',  
    data: null
  });
 }


 User.findByIdAndUpdate(req.decodedToken.user._id,{$set: req.body},{ new: true }).exec (function(err, updatedUser) {
  if (err) {
    return next(err);
  }
  res.status(201).json({
    err: null,
    msg: 'Description updated successfully.',
    data: updatedUser
  });
});
 
}

module.exports.getimage = function(req, res) {
  //mo2ktn lol
    User.findById('5ac2107b3a8e6955b45b4bed').exec (function(err, User) {
      if (err) {
         return next(err);
       }
       console.log(User)
       res.status(201).json({
         err: null,
         msg: 'i.',
         data: User.img
       });
     });
  };

module.exports.uploadimage = function(req, res) {
  User.findByIdAndUpdate('5ac2107b3a8e6955b45b4bed',{
    $set: {
      img: req.file.buffer
    }
},{ new: true }).exec (function(err, updatedUser) {
    if (err) {
       return next(err);
     }
     console.log(updatedUser)
     res.status(201).json({
       err: null,
       msg: 'image got updated.',
       data: updatedUser.img
     });
   });

  /* if (null == null){
    return res.status(201).json({
      err: null,
      msg: 'done.',
      data: req.file.originalname
    });
  } else {
    res.status(201).json({
      err: null,
      msg: 'err',
      data: User
    });
  } */
};


module.exports.updateRating = function(req, res, next) {
    console.log("hi")
     console.log(req.body);
     console.log(req.email);
     console.log(req.decodedToken);
    console.log("hi1");
   
   
    User.findByIdAndUpdate( '5ac16eeb4d1c4c67871d7a12',{$set: req.body},{ new: true }).exec (function(err, updatedUser) {
     console.log("hi2");
     
     res.status(201).json({
       err: null,
       msg: 'Rating updated successfully.',
       data: updatedUser
     });
   });
    
   }
   