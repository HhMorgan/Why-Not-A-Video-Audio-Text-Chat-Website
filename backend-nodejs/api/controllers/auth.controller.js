var mongoose = require('mongoose'),
  fs = require('fs'),
  jwt = require('jsonwebtoken'),
  Validations = require('../utils/validations'),
  Encryption = require('../utils/encryption'),
  EMAIL_REGEX = require('../config/appconfig').EMAIL_REGEX,
  User = mongoose.model('User'),
  crypto = require('crypto'),
  nodemailerController = require('./nodemailer.controller');

// authenticating sender email
module.exports.login = function (req, res, next) {
  // Check that the body keys are in the expected format and the required fields are there
  var valid =
    req.body.email &&
    Validations.isString(req.body.email) &&
    Validations.matchesRegex(req.body.email, EMAIL_REGEX) &&
    req.body.password &&
    Validations.isString(req.body.password);

  if (!valid) {
    return res.status(422).json({
      err: null,
      msg: 'email(String and of valid email format) and password(String) are required fields.',
      data: null
    });
  }

  // Find the user with this email from the database
  User.findOne({ email: req.body.email.trim().toLowerCase(), }, { _id: 1, username: 1, email: 1, password: 1, blocked: 1, role: 1 }).exec(function (err, user) {
    if (err) {
      return next(err);
    }
    // If user not found then he/she is not registered
    if (!user) {
      return res
        .status(404)
        .json({ err: null, msg: 'User not found.', data: null });
    }

    // If user found then check that the password he entered matches the encrypted hash in the database
    Encryption.comparePasswordToHash(req.body.password, user.password, function (err, passwordMatches) {
      if (err) {
        return next(err);
      }
      // If password doesn't match then its incorrect
      if (!passwordMatches) {
        return res
          .status(401)
          .json({ err: null, msg: 'Password is incorrect.', data: null });
      }
      if (user.blocked)
        return res.status(401).json({ err: null, msg: 'Blocked', data: null });
      // Create a JWT and put in it the user object from the database

      delete user.blocked;
      var token = jwt.sign(
        {
          // user.toObject transorms the document to a json object without the password as we can't leak sensitive info to the frontend
          user: user
        },
        req.app.get('secret'),
        {
          expiresIn: '12h'
        }
      );
      res.status(200).json({ err: null, msg: 'Welcome', data: token });
    });
  });
};

//===========================================================================


module.exports.signup = function (req, res, next) {
  var valid = req.body.username && Validations.isString(req.body.username) &&
    req.body.password && Validations.isString(req.body.password) &&
    req.body.email && Validations.isString(req.body.email);
  console.log(req.body);
  if (!valid) {
    return res.status(422).json({
      err: null,
      msg: 'username (String) , email (String) , and password (String) are required fields.',
      data: null
    });
  }
  User.findOne({ $or: [{ username: { $eq: req.body.username } }, { email: { $eq: req.body.email } }] }, function (err, user) {
    if (err)
      throw err;
    if (user == null) {
      var password = req.body.password.trim();
      Encryption.hashPassword(password, function (err, hash) {
        if (err) {
          return next(err);
        }
        // creating a verification token to enable user to verify his email
        var token = crypto.randomBytes(16).toString('hex');
        req.body.password = hash;
        req.body.verificationToken = token;
        // Confirmation url which will be sent to user
        let confirmationUrl = 'http://localhost:4200/#/page' + `/confirm/${req.body.email}/${token}`;
        nodemailerController.sendEmail(
          req.body.email,
          'Account Verification Token',
          'Click the following link to confirm your account:</p>' + confirmationUrl ,
          function(done) {
            console.log(done);
            if(done){
              User.create(req.body, function (err, newUser) {
                if (err) {
                  return next(err);
                }
                return res.status(201).json({
                  err: null,
                  msg: 'Registration successful, you can now login to your account.',
                  data: newUser
                });
              });
            } else {
              return res.status(412).json({
                err: null,
                msg: 'Registration Failed',
                data: null
              })
            }
          }
        );
      });
    } else
      return res.status(412).json({
        err: null,
        msg: 'Registration Failed',
        data: null
      })
  })
};

module.exports.signup2 = function(req , res , next) {
  var valid = req.body.username && Validations.isString(req.body.username) &&
  req.body.password && Validations.isString(req.body.password) &&
  req.body.email && Validations.isString(req.body.email) &&
  req.body.role && Validations.isString(req.body.role);
  console.log(req.body.password);
console.log(req.body);
console.log(valid);
if (!valid) {
  return res.status(422).json({
    err: null,
    msg: 'username (String) , email (String) , and password (String) are required fields.',
    data: null
  });
}
User.findOne({ $or: [{ username: { $eq: req.body.username } }, { email: { $eq: req.body.email } }] }, function (err, user) {
  if (err)
    throw err;
  if (user == null) {
    var password = req.body.password.trim();
    Encryption.hashPassword(password, function (err, hash) {
      if (err) {
        return next(err);
      }
      // creating a verification token to enable user to verify his email
      var token = crypto.randomBytes(16).toString('hex');
      req.body.password = hash;
      req.body.verificationToken = token;
      // Confirmation url which will be sent to user
      let confirmationUrl = 'http://localhost:4200/#/page' + `/confirm/${req.body.email}/${token}`;
      nodemailerController.sendEmail(
        req.body.email,
        'Account Verification Token',
        'Click the following link to confirm your account:</p>' + confirmationUrl ,
        function(done) {
          console.log(done);
          if(done){
            User.create(req.body, function (err, newUser) {
              if (err) {
                return next(err);
              }
              return res.status(201).json({
                err: null,
                msg: 'Registration successful, you can now login to your account.',
                data: newUser
              });
            });
          } else {
            return res.status(412).json({
              err: null,
              msg: 'Registration Failed',
              data: null
            })
          }
        }
      );
    });
  } else
    return res.status(412).json({
      err: null,
      msg: 'Registration Failed',
      data: null
    })
})
};

module.exports.confirmEmail = function (req, res, next) {
  // finds a user with verification token appended to the url url
  var valid = req.params.email && Validations.isString(req.params.email) &&
    req.params.token && Validations.isString(req.params.email);
  if (valid) {
    User.findOne({ email: req.params.email, verificationToken: req.params.token }, function (err, user) {
      if (err)
        throw err;
      if (!user) {
        return res.status(404).json({
          err: null,
          msg: 'Failed to verify your email.',
          data: null
        })
      } else {
        // Handles the case that user already verified his account
        if (user.isVerified) {
          return res.status(209).json({
            err: null,
            msg: 'This user has already been verified.',
            data: null
          });
        } else {
          //changes the status of user.isVerified to true
          user.isVerified = true;
          user.save(function (err) {
            if (err) {
              return next(err);
            }
            return res.status(200).json({
              err: null,
              msg: user.email + " has been verified.",
              data: null
            });
          });
        }
      }
    })
  } else {
    return res.status(422).json({
      err: null,
      msg: "Invalid Email or Token",
      data: null
    })
  }
};

module.exports.resendConfirmation = function (req, res, next) {
  User.findById(req.decodedToken.user._id, function (err, user) {
    if (!user) {
      return res.status(209).json({
        err: null,
        msg: 'We were unable to find a user with that email.',
        data: null
      });
    } else {

    }

    if (user.isVerified) {
      return res.status(400).json({
        err: null,
        msg: 'This user has already been verified.',
        data: null
      });
    } else {
      // Creates new verification token to resend it to the user
      var token = crypto.randomBytes(16).toString('hex');
      user.verificationToken = token;
      user.save(function (err) {
        if (err) {
          return next(err);
        }
        // Confirmation url which will be sent to user
        let confirmationUrl = 'http://localhost:4200/#/page' + `/confirm/${req.body.email}/${token}`;
        nodemailerController.sendEmail(
          user.email,
          'Account Verification Token',
          'Click the following link to confirm your account:</p>' + confirmationUrl
        );
      });
    }
  });
};