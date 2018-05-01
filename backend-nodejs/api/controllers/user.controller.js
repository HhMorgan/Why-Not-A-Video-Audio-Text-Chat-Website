var mongoose = require('mongoose'),
  moment = require('moment'),
  jwt = require('jsonwebtoken'),
  Validations = require('../utils/validations'),
  Encryption = require('../utils/encryption'),
  EMAIL_REGEX = require('../config/appconfig').EMAIL_REGEX,
  User = mongoose.model('User'),
  Request = mongoose.model('Request'),
  OfferedSlot = mongoose.model('OfferedSlot'),
  schedule = mongoose.model('Schedule'),
  moment = require('moment');
var Binary = require('mongodb').Binary;
var fs = require('fs');
var bcrypt = require('bcryptjs');
Tag = mongoose.model('Tag');
var RegExp = require('mongodb').RegExp;
 

//this function searches for the user that has tags which are the similar to the searchtag parameter
module.exports.searchUserbyTags = function (req, res, next) {
  Tag.find({ name: { $regex: req.params.searchtag , $options: "$i" } , blocked : { $eq: "false" } , status: { $eq: "Accepted" }}).exec (function(err, Tags) {
   
    if (err) {
      return next(err);
    }

    else if (Tags.length==0) {
      return res.status(404).json({
        err: null,
        msg: 'Tags not found',
        data: null
      });
    }

User.find({ speciality: { $in: Tags } , role : { $eq: "expert" } , blocked : { $eq: "false" }  }).populate('speciality').exec (function(err, User) {
  if (err) {
     return next(err);
   }
   else if ( User.length==0 ) {
    return res.status(404).json({
      err: null,
      msg: 'no Users with such a Tag ',
      data: null
    });
  }
   res.status(201).json({
     err: null,
     msg: 'i.',
     data: User
   });
   //res.end();
 });
});
};

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

//this function searches for tags which are the similar to the searchtag parameter

module.exports.searchbyTags = function (req, res, next) {

    Tag.find({ name: { $regex: req.params.searchtag, $options: "$i" }, blocked: { $eq: "false" }, status:{$eq:"Accepted"} }).exec(function (err, tag) {
      if (err) {
        return next(err);
      }
      else if ( tag.length==0) {
        return res.status(404).json({
          err: null,
          msg: 'Tags not found',
          data: null
        });
      }
      else if ( tag) {
        return res.status(200).json({
          err: null,
          msg: 'Tags retrieved successfully.',
          data: tag
        });
      }
    });

};

module.exports.searchbyUser = function (req, res, next) {
    
  User.find({ username: { $regex: req.params.searchtag, $options: "$i" }, role:{$eq:"expert"},blocked:{$eq:"false"} }).exec(function (err, user) {
    if (err) {
      return next(err);
    }
    else if ( !user) {
      return res.status(404).json({
        err: null,
        msg: 'user not found',
        data: null
      });
    }
    else if ( user) {
      return res.status(200).json({
        err: null,
        msg: 'users retrieved successfully.',
        data: user
      });
    }
  });

};



module.exports.loadStatus = function (req, res) {
  User.findById(req.decodedToken.user._id).exec(function (err, User) {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      err: null,
      msg: 'i.',
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
    return res.status(201).json({
      err: null,
      msg: null,
      data: { buffer: user.img.data, contentType: user.img.contentType }
    });
  });
};

module.exports.getUserProfile = function (req, res) {
  User.findOne({ username: { $eq: req.params.username } }).populate('speciality').populate('bookmarks' , 'username role img').exec(function (err, user) {
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

module.exports.getusername = function (req, res) {
  User.findById(req.decodedToken.user._id).exec(function (err, user) {
    if (err) {
      return next(err);
    }
    return res.status(201).json({
      err: null,
      msg: null,
      data: user.username
    });
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
      }
      User.findByIdAndUpdate(req.decodedToken.user._id, { $set: req.body }, { new: true }).exec(function (err, updatedUser) {
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
};

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
        Encryption.comparePasswordToHash( req.body.oldPassword , user.password , function (err, matches) {

            if (err) {
              return next(err);
            }
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

module.exports.getOfferedSlots = function (req, res, next) {
  OfferedSlot.find({ user_email: req.decodedToken.user.email }).exec(function (err, OfferedSlotsTable) {
    if (err) {
      return next(err);
    }
    if (!OfferedSlotsTable) {
      return res.status(404).json({ err: null, msg: 'You are still not offered any slots', data: null });
    }
    res.status(200).json({
      err: null,
      msg: 'Here are your offered appointments',
      data: OfferedSlotsTable
    });
  });
};

module.exports.reserveSlot = function (req, res, next) {
  OfferedSlot.findOneAndUpdate({ $and: [{ user_email: req.decodedToken.user.email }, { expert_email: req.body.expert_email }] }, { $set: { status: req.body.status } }, function (err, updatedTable) {
    if (err) {
      return next(err);
    }
    if (!updatedTable) {
      return res.status(404).json({ err: null, msg: 'Record not found.', data: null });
    }
    return res.status(200).json({
      err: null,
      msg: 'Successfully reserved/declined slot.',
      data: updatedTable
    });
  });
};

module.exports.viewSuggestedExperts = function (req, res, next) {
  Tag.findOne({ name: { $regex: req.params.tagName , $options: "$i" } , blocked : false , status : "Accepted" }).exec( function (err , tag) {
    if(tag){
      User.find({ _id : { $ne : req.decodedToken.user._id } , "speciality" : tag._id , "role": "expert" , blocked : false } ,
       { _id : 1 , username : 1 , role : 1 , speciality : 1  , rating : 1 , img : 1 }).populate('speciality','name').exec(function (err, User) {
        if (err) {
          return next(err);
        }
        return res.status(200).json({
          err: null,
          msg: 'Experts retrieved successfully.',
          data: User
        });
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

      User.findOneAndUpdate({ _id : { $eq : req.decodedToken.user._id} , bookmarks: { $ne: req.params.expertId }},
        { $push: { bookmarks: req.params.expertId } }, { new : true } , function (err, user) {

          if (err) {
            return next(err);
          }
          if (!user) {
            return res.status(404).json({ 
              err: null , 
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

module.exports.findUserbyId = function (req, res, next) {
  console.log(req.body);
  User.find({ _id: req.body  }).exec(function (err, User) {
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
