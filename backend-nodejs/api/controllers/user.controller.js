var mongoose = require('mongoose'),
  moment = require('moment'),
  crypto = require('crypto'),
  jwt = require('jsonwebtoken'),
  Validations = require('../utils/validations'),
  Encryption = require('../utils/encryption'),
  nodemailerController = require('./nodemailer.controller'),
  EMAIL_REGEX = require('../config/appconfig').EMAIL_REGEX,
  Tag = mongoose.model('Tag'),
  User = mongoose.model('User'),
  Request = mongoose.model('Request'),
  schedule = mongoose.model('Schedule'),
  moment = require('moment');
var Binary = require('mongodb').Binary;
var fs = require('fs');
var bcrypt = require('bcryptjs');
var RegExp = require('mongodb').RegExp;



module.exports.changeUserStatus = function (req, res, next) {
  /* Add Validations */
  delete req.body.email;
  console.log(req.body);
  User.findByIdAndUpdate(req.decodedToken.user._id, { $set: req.body }, { new: true }).exec(function (err, updatedUser) {
    if (err) {
      return next(err);
    }
    return res.status(201).json({
      err: null,
      msg: 'Online Status Successfully Toggled.',
      data: updatedUser
    });
  });
};

module.exports.loadStatus = function (req, res) {
  User.findById(req.decodedToken.user._id).exec(function (err, User) {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      err: null,
      msg: 'user status loaded successfully.',
      data: User.onlineStatus
    });
    //res.end();
  });
};

module.exports.getimage = function (req, res) {
  User.findById(req.decodedToken.user._id).exec(function (err, user) {
    if (err) {
      return next(err);
    }
    if(user){
      return res.status(200).json({
        err: null,
        msg: null,
        data: (user.img.data && user.img.contentType) ?
          { data: user.img.data, contentType: user.img.contentType } : null
      });
    } else {
      return res.status(404).json({
        err: null,
        msg: 'User Not Found',
        data: null
      })
    }
    
  });
};

module.exports.getUserProfile = function (req, res) {
  User.findOne({ username: { $eq: req.params.username } }).populate('speciality').populate('bookmarks', 'username role img').exec(function (err, user) {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(404).json({
        err: null,
        msg: 'user not found',
        data: null
      });
    } else {
      return res.status(201).json({
        err: null,
        msg: null,
        data: user
      });
    }
  });
};

module.exports.getUserData = function (req, res) {
  User.findById(req.decodedToken.user._id).exec(function (err, user) {
    if (!user) {
      return res.status(404).json({
        err: null,
        msg: 'user not found',
        data: null
      });
    }
    else if (err) {
      return next(err);
    }
    else {
      return res.status(201).json({
        err: null,
        msg: null,
        data: user
      });
    }
  });
};

//this function is used to upload an image (buffer) to the database
module.exports.uploadimage = function (req, res) {
  User.findByIdAndUpdate(req.decodedToken.user._id, { $set: { img: { data: req.file.buffer, contentType: req.file.mimetype } } },
    { new: true }).exec(function (err, updatedUser) {
      /* Checks For File Type */
      if (err) {
        return next(err);
      }
      return res.status(201).json({
        err: null,
        msg: 'image got updated.',
        data: { buffer: updatedUser.img.data, contentType: updatedUser.img.contentType } /* Hnn3ml load el new Image From El Browser B3d El Checks 
       Only Confirmation Message Is Needed*/
      });
    });

};

//this function is used to upload an image (buffer) to the database
module.exports.uploadCoverPic = function (req, res) {
  User.findByIdAndUpdate(req.decodedToken.user._id, { $set: { CoverImg: { data: req.file.buffer, contentType: req.file.mimetype } } },
    { new: true }).exec(function (err, updatedUser) {
      /* Checks For File Type */
      if (err) {
        return next(err);
      }
      return res.status(201).json({
        err: null,
        msg: 'Cover Pic got updated.',
        data: { buffer: updatedUser.CoverImg.data, contentType: updatedUser.CoverImg.contentType } /* Hnn3ml load el new Image From El Browser B3d El Checks 
       Only Confirmation Message Is Needed*/
      });
    });
};
/*
allows the user to update his Email
*/
module.exports.updateEmail = function (req, res, next) {
  if (!Validations.matchesRegex(req.body.email, EMAIL_REGEX)) {
    return res.status(422).json({
      err: null,
      msg: 'Email must be in correct format.',
      data: null
    });
  }
  delete req.body.updatedAt;
  req.body.updatedAt = moment().toDate();

  User.findById(req.decodedToken.user._id).exec(function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(404).json({ err: null, msg: 'User not found.', data: null });
    }
    //exec method returns the matched text if it finds a match, otherwise it returns null.

    User.findOne({ email: req.body.email.trim().toLowerCase() }).exec(function (err, updatedUser) {
      // If an err occurred, call the next middleware in the app.js which is the error handler
      if (err) {
        return next(err);
      }
      // If there is a user with this email don't continue
      if (updatedUser) {
        return res.status(422).json({
          err: null,
          msg: 'A user with this email address already exists, please try another email address.',
          data: null
        });
      } else {
        var verificationEmailToken = crypto.randomBytes(16).toString('hex');

        var token = jwt.sign(
          {
            user: { _id : user._id , email: req.body.email.trim().toLowerCase() , verify : "Email" , 
            token : verificationEmailToken }
          },
          req.app.get('secret'),
          {
            expiresIn: '6h'
          }
        );
        let confirmationUrl = 'http://whatwhynot.net/#/page' + `/verify/${token}`;
        nodemailerController.sendEmail(
          req.body.email,
          'Email Update',
          'Click the following link to confirm your new Email :</p>' + confirmationUrl,
          function(done){
            if(done){
              user.verificationEmailToken = verificationEmailToken;
              user.save(function(err){
                if(err){
                  next(err);
                } else {
                  return res.status(201).json({
                    err: null ,
                    msg: 'Email update Request Sent To '+ req.body.email ,
                    data: null
                  });
                }
              })
            } else {
              return res.status(503).json({
                err: null ,
                msg: 'Email Failed to send Update Request To '+ req.body.email ,
                data: null
              });
            }
          }
        )
      }
    });
  });
};

/*
allows the user to update his Password
*/
module.exports.updatePassword = function (req, res, next) {

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

  Encryption.hashPassword(password, function (err, hash) {
    if (err) {
      return next(err);
    }

    User.findById(req.decodedToken.user._id).exec(function (err, user) {
      if (err) {
        return next(err);
      }
      Encryption.hashPassword(req.body.oldPassword, function (err, hash2) {
        if (err) {
          return next(err);
        }
        Encryption.comparePasswordToHash(req.body.oldPassword, user.password, function (err, matches) {

          if (err) {
            return next(err);
          }
          console.log(req.body.oldPassword);

          console.log
          if (!matches) {
            return res.status(422).json({
              err: null,
              msg: 'wrong old password',
              data: null
            });
          }
          req.body.password = hash;
          User.findByIdAndUpdate(req.decodedToken.user._id, { $set: req.body }, { new: true }).exec(function (err, updatedUser) {
            if (err) {
              return next(err);
            }
            return res.status(201).json({
              err: null,
              msg: 'Password updated successfully.',
              data: updatedUser
            });
          });
        });
      });
    });
  });
};

/*
allows the user to update his Description
*/
module.exports.updateDescription = function (req, res, next) {
  if (!(Validations.isString(req.body.description))) {
    return res.status(422).json({
      err: null,
      msg: 'Description must be of String format',
      data: null
    });
  }
  User.findByIdAndUpdate(req.decodedToken.user._id, { $set: req.body }, { new: true }).exec(function (err, updatedUser) {
    if (err) {
      return next(err);
    }
    return res.status(201).json({
      err: null,
      msg: 'Description updated successfully.',
      data: updatedUser
    });
  });
};

module.exports.updateRating = function (req, res, next) {
  User.findByIdAndUpdate(req.decodedToken.user._id, { $set: req.body }, { new: true }).exec(function (err, updatedUser) {
    delete updatedUser.img;
    return res.status(201).json({
      err: null,
      msg: 'Rating updated successfully.',
      data: updatedUser
    });
  });
};

module.exports.getExpertSchedule = function (req, res, next) {
  User.findById(req.decodedToken.user._id).exec(function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(404).json({ err: null, msg: 'User not found.', data: null });
    }
    schedule.find({
      expertEmail: req.params.expertEmail,

    }).exec(function (err, slots) {
      if (err) {
        return next(err);
      }
      res.status(200).json({
        err: null,
        msg: ' slots defined by expert retrieved successfully.',
        data: slots
      });
    });
  });
};

module.exports.upgradeToExpert = function (req, res, next) {
  var valid = req.body.type && Validations.isString(req.body.type) &&
    // req.body.sender && Validations.isString(req.body.sender) &&
    req.body.recipient && Validations.isString(req.body.recipient)
  if (!valid) {
    return res.status(422).json({
      err: null,
      msg: 'The sender, the recipent and the type of the request are required string fields.',
      data: null
    });
  }
  User.findById(req.decodedToken.user._id).exec(function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(404).json({ err: null, msg: 'User not found.', data: null });
    }
    req.body.sender = req.decodedToken.user.username;
    delete req.body.createdAt;
    delete req.body.status;
    delete req.body.viewed;
    Request.create(req.body, function (err, request) {
      if (err) {
        return next(err);
      }
      return res.status(201).json({
        err: null,
        msg: 'Your request to being an expert has been sent to the admin.',
        data: request
      });
    });
  });
};

//this function searches for tags which are the similar to the searchtag parameter
module.exports.searchbyTags = function (req, res, next) {

  Tag.find({ name: { $regex: req.params.searchtag, $options: "$i" }, blocked: { $eq: "false" }, status: { $eq: "Accepted" } }).exec(function (err, tag) {
    if (err) {
      return next(err);
    }
    else if (tag.length == 0) {
      return res.status(404).json({
        err: null,
        msg: 'Tags not found',
        data: null
      });
    }
    else if (tag) {
      return res.status(200).json({
        err: null,
        msg: 'Tags retrieved successfully.',
        data: tag
      });
    }
  });

};

module.exports.searchbyUser = function (req, res, next) {

  User.find({ _id: { $ne: req.decodedToken.user._id} , username: { $regex: req.params.searchtag, $options: "$i" } , $or:[ { role: "expert" } , { role: "user"  } ], blocked: { $eq: "false" } }).exec(function (err, user) {
    if (err) {
      return next(err);
    }
    else if (!user) {
      return res.status(404).json({
        err: null,
        msg: 'user not found',
        data: null
      });
    }
    else if (user) {
      return res.status(200).json({
        err: null,
        msg: 'users retrieved successfully.',
        data: user
      });
    }
  });

};

/*
  Views all the experts whose specialty includes the searched tag
*/
module.exports.viewSuggestedExperts = function (req, res, next) {
  var valid = req.params.tagName && Validations.isString(req.params.tagName);
  if(!valid){
    return res.status(422).json({
      err: null,
      msg: 'Not A String',
      data: null
    });
  }
  Tag.findOne({ name: { $regex: req.params.tagName, $options: "$i" }, blocked: false, status: "Accepted" }).exec(function (err, tag) {
    if (tag) {
      User.find({ _id: { $ne: req.decodedToken.user._id }, "speciality": tag._id, "role": "expert", blocked: false },
        { _id: 1, username: 1, role: 1, speciality: 1, rating: 1, img: 1 }).populate('speciality', 'name').exec(function (err, users) {
          if (err) {
            return next(err);
          }
          if (users.length != 0) {
            return res.status(200).json({
              err: null,
              msg: 'Experts retrieved successfully.',
              data: users
            });
          } else {
            return res.status(404).json({
              err: null,
              msg: 'Unable to Find Experts Tagged With ' + tag.name + ' .',
              data: users
            });
          }
        });
    } else {
      return res.status(404).json({
        err: null,
        msg: 'Tag Not Found',
        data: null
      })
    }
  });
};

//adding an expert to the array of bookmarks of a certain user
module.exports.addToBookmarks = function (req, res, next) {

  if (!Validations.isObjectId(req.params.expertId)) {
    return res.status(422).json({
      err: null,
      msg: 'The expert ID sent must be a valid ObjectId.',
      data: null
    });
  }
  User.findById(req.decodedToken.user._id).exec(function (err, user) {

    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(404).json({ err: null, msg: 'User not found.', data: null });
    }
    User.find({ _id: req.params.expertId, role: 'expert' }).exec(function (err, expert) {
      if (err) {
        return next(err);
      }
      if (!expert) {
        return res.status(404).json({
          err: null,
          msg: 'The expert you are trying to add to your bookmarks is either not found or not an expert.',
          data: null
        });
      }

      User.findOneAndUpdate({ _id: { $eq: req.decodedToken.user._id }, bookmarks: { $ne: req.params.expertId } },
        { $push: { bookmarks: req.params.expertId } }, { new: true }, function (err, user) {

          if (err) {
            return next(err);
          }
          if (!user) {
            return res.status(404).json({
              err: null,
              msg: 'The expert could not be added to your bookmarks because '
                + ' he/she is already added to your bookmarks.',
              data: null
            });
          }
          return res.status(201).json({
            err: null,
            msg: 'The expert was successfully added to your array of bookmarks.',
            data: req.params.expertId
          });
        });
    });

  });
};

//user requests to see the experts he/she added to his/her array
module.exports.viewBookmarks = function (req, res, next) {

  User.findById(req.decodedToken.user._id).exec(function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(404).json({ err: null, msg: 'User not found.', data: null });
    }

    if (!user.bookmarks) {
      return res.status(404).json({ err: null, msg: 'Bookmarks not found.', data: null });
    }
    return res.status(200).json({
      err: null,
      msg: 'Bookmarks retrieved successfully.',
      data: user.bookmarks
    });

  });
};

module.exports.removeFromBookmarks = function (req, res, next) {
  User.findOneAndUpdate({
    _id: { $eq: req.decodedToken.user._id },
    //search for the tag id that should be removed in the array of specialities with its id
    bookmarks: { $eq: req.params.expertId }
  }, { $pull: { bookmarks: req.params.expertId } }, { new: true }, function (err, updateduser) {
    if (err) {
      return next(err);
    }
    return res.status(201).json({
      err: null,
      msg: 'bookmark removed',
      data: updateduser.bookmarks
    });
  });
};

module.exports.findUsersByID = function (req, res, next) {
  var valid = req.body.ids && Validations.isArray(req.body.ids);
  if(!valid){
    return res.status(422).json({
      err: null,
      msg: 'Not An Array',
      data: null
    });
  } else {
    for( id of req.body.ids){
      if(!Validations.isObjectId(id)){
        return res.status(422).json({
          err: null,
          msg: 'Not An ObjectId',
          data: null
        });
      }
    }
  }
  User.find({ _id: { $in : req.body.ids } },{ _id: 1 , username: 1 , role: 1 , img: 1 }).exec(function (err, User) {
    if (err) {
      return next(err);
    }
    if (!User) {
      return res.status(404).json({
        err: null,
        msg: 'This Tag is not found ',
        data: null
      });
    }
    return res.status(201).json({
      err: null,
      msg: 'Succesfully retrieved Users',
      data: User
    });
  })
};