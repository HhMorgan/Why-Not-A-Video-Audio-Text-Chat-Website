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
      var token = jwt.sign(
        {
          // user.toObject transorms the document to a json object without the password as we can't leak sensitive info to the frontend
          user: { _id: user._id, username: user.username, email: user.email, role: user.role }
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

//the function that register users to the database
module.exports.signup = function (req, res, next) {
  var valid = req.body.username && Validations.isString(req.body.username) &&
    req.body.password && Validations.isString(req.body.password) &&
    req.body.email && Validations.isString(req.body.email) && Validations.matchesRegex(req.body.email, EMAIL_REGEX);
  if (!valid) {
    return res.status(422).json({
      err: null,
      msg: 'username (String) , email (String) , and password (String) are required fields.',
      data: null
    });
  }
  req.body.username = req.body.username.trim().replace(/\s+/g, '-');
  User.findOne({ $or: [{ username: { $eq: req.body.username } }, { email: { $eq: req.body.email.trim().toLowerCase() } }] }, function (err, user) {
    if (err)
      throw err;
    if (user == null) {
      var password = req.body.password.trim();
      Encryption.hashPassword(password, function (err, hash) {
        if (err) {
          return next(err);
        }
        if (!req.body.role) {
          req.body.role = 'user';
        }
        User.create({ username: req.body.username, email: req.body.email.trim().toLowerCase(), role: req.body.role, password: hash, verificationToken: crypto.randomBytes(16).toString('hex') }, function (err, newUser) {
          if (err) {
            return next(err);
          } else {
            var token = jwt.sign(
              {
                user: { _id : newUser._id , email: newUser.email , verify : "Account" , 
                token : newUser.verificationToken }
              },
              req.app.get('secret'),
              {
                expiresIn: '2h'
              }
            );
            // Confirmation url which will be sent to user
            let confirmationUrl = 'https://whatwhynot.net/#/page' + `/verify/${token}`;
            nodemailerController.sendEmail(
              req.body.email,
              'Account Verification Token',
              'Click the following link to confirm your account:</p>' + confirmationUrl,
              function (done) {
                if (done) {
                  console.log(req.body);
                  return res.status(201).json({
                    err: null,
                    msg: 'Registration successful, you can now login to your account.',
                    data: newUser
                  });
                } else {
                  User.remove({ _id: newUser._id }, function (err) {
                    if (!err) {
                      return res.status(412).json({
                        err: null,
                        msg: 'Registration Failed',
                        data: null
                      })
                    }
                  })
                }
              }
            )
          }
        });
      });
    } else
      return res.status(412).json({
        err: null,
        msg: 'Registration Failed',
        data: null
      })
  })
};

module.exports.forgetPassword = function (req, res, next) {
  var valid = req.body.email && Validations.isString(req.body.email) && Validations.matchesRegex(req.body.email, EMAIL_REGEX);
  if (!valid) {
    return res.status(422).json({
      err: null,
      msg: 'username (String) , email (String) , and password (String) are required fields.',
      data: null
    });
  } else {
    User.findOne({ email : req.body.email.trim().toLowerCase() },function(err,user){
      if(user){
        var password = crypto.randomBytes(16).toString('hex');
        var token = jwt.sign(
          {
            user: { _id : user._id , email: user.email , verify : "Password" , token : password }
          },
          req.app.get('secret'),
          {
            expiresIn: '2h'
          }
        );
        let confirmationUrl = 'https://whatwhynot.net/#/page' + `/verify/${token}`;
        nodemailerController.sendEmail(
          req.body.email,
          'Account Reset Password ' + `${password}`,
          'Click the following link to reset Password of your account:</p>' + confirmationUrl,
          function (done) {
            if(done){
              return res.status(200).json({
                err: null,
                msg: 'Account Reset Link Sent Successfully',
                data: null
              });
            } else {
              return res.status(200).json({
                err: null,
                msg: 'Account Reset Link Failed To Send',
                data: null
              });
            }
          }
        )
      } else {
        return res.status(404).json({
          err: null,
          msg: 'Unable To Find An Account With This Email',
          data: null
        });
      }
    })
  }
}

module.exports.verify = function (req, res, next) {
  // finds a user with verification token appended to the url url
  var valid = req.params.token && Validations.isString(req.params.token);
  if (valid) {
    jwt.verify(req.params.token, req.app.get('secret'), function (err, decodedToken) {
      if (err) {
        return res.status(401).json({
          error: err,
          msg: 'Token Timed Out',
          data: null
        });
      }
      switch (decodedToken.user.verify) {
        case "Email":
          User.findOneAndUpdate({ _id: decodedToken.user._id, verificationEmailToken: decodedToken.user.token },
            { $set: { email: decodedToken.user.email }, $unset: { verificationEmailToken: 1 } },
            { new: false }, function (err, user) {
              if (user) {
                return res.status(200).json({
                  err: null,
                  msg: user.email + ' Updated to ' + decodedToken.user.email,
                  data: null
                })
              } else {
                return res.status(200).json({
                  err: null,
                  msg: ' Unable to Verify Email ' + decodedToken.user.email,
                  data: null
                })
              }
            })
          break;
        case "Account":
          User.findOneAndUpdate({ _id: decodedToken.user._id, verificationToken: decodedToken.user.token },
            { $set: { isVerified: true }, $unset: { verificationToken: 1 } }, { new: true }, function (err, user) {
              if (user) {
                return res.status(200).json({
                  err: null,
                  msg: user.username + ' Account is now Verified ',
                  data: null
                })
              } else {
                return res.status(200).json({
                  err: null,
                  msg: ' Unable to Verify Account ' + decodedToken.user.email,
                  data: null
                })
              }
            })
        break;
        case "Password":
          Encryption.hashPassword( decodedToken.user.token , function (err, hash) { 
            if(hash){
              User.findByIdAndUpdate( decodedToken.user._id , { $set :{ password : hash } } , function( err , user ){
                if(user){
                  return res.status(200).json({
                    err: null,
                    msg: 'User ' + user.username + ' Password Reseted Successfully',
                    data: null
                  })
                } else {
                  return res.status(404).json({
                    err: null,
                    msg: 'Unable To Find User',
                    data: null
                  })
                }
              });
            }
          });
        break;
      }
    });
  } else {
    return res.status(422).json({
      err: null,
      msg: 'Invalid Data.',
      data: null
    })
  }
};