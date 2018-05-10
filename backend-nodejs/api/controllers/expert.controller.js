/* 
The  controller that handles all the functionality that an expert can do.
An expert can view the his/her pending slot requests created by another user --> "viewSlotRequests".
An expert can accept/reject a slot request --> "editSlotRequest".
*/
var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose'),
Request = mongoose.model('Request'),
User = mongoose.model('User'),
Tag = mongoose.model('Tag'),
Validations = require('../utils/validations');

//This function is responsible for adding a speciality for the expert,only if it exists in the tag table
module.exports.addSpeciality = function (req, res, next) {
  var valid = req.params.tagId && Validations.isObjectId(req.params.tagId);
  if (!valid) {
    return res.status(422).json({
      err: null,
      msg: 'Speciality: ' + req.params.tagId + ' is not valid.',
      data: null
    });
  }
  //will be added when integrated with Tags
  Tag.findOne({ _id: req.params.tagId, status: { $eq: 'Accepted' }, blocked: { $eq: false } }, function (err, tag) {
    if (err) {
      return next(err);
    }
    if (!tag) {
      return res.status(404).json({
        err: null,
        msg: 'This Tag is not found or is blocked. + Please request this tag first then add it as speciality',
        data: null
      });
    }
    //need to check on role first before adding the speciality
    // If Tag was found in tag table then add it in user table
    User.findOneAndUpdate({
      _id: { $eq: req.decodedToken.user._id }, role: { $eq: 'expert' },
      speciality: { $ne: tag._id }
    }, { $push: { speciality: tag._id } }, { new: true }, function (err, updateduser) {
      if (err) {
        return next(err);
      }
      if (!updateduser) {
        return res.status(404).json({
          err: null,
          msg: 'Speciality could not be added either it already exists or u are not an expert or a user',
          data: null
        });
      }
      return res.status(201).json({
        err: null,
        msg: 'Speciality added',
        data: updateduser.speciality
      });
    });
  });
};

//This is the function responsible for editing a certain speciality (removing this speciality)
module.exports.editSpeciality = function (req, res, next) {
  var valid = req.params.tagId && Validations.isObjectId(req.params.tagId);
  if (!valid) {
    return res.status(422).json({
      err: null,
      msg: 'Speciality: ' + req.params.tagId + ' is not valid.',
      data: null
    });
  }
  User.findOneAndUpdate({
    _id: { $eq: req.decodedToken.user._id }, role: { $eq: 'expert' },
    //search for the tag id that should be removed in the array of specialities with its id
    speciality: { $eq: req.params.tagId }
  }, { $pull: { speciality: req.params.tagId } }, { new: true }, function (err, updateduser) {
    if (err) {
      return next(err);
    }
    if (!updateduser) {
      return res.status(404).json({
        err: null,
        msg: 'Speciality could not be removed u are not an expert or a user',
        data: null
      });
    }
    return res.status(201).json({
      err: null,
      msg: 'Speciality removed',
      data: updateduser.speciality
    });
  });
};

module.exports.findTagbyname = function (req, res, next) {

  Tag.findOne({ name: req.params.tagname  }).exec(function (err, tag) {
    if (err) {
      return next(err);
    }
    if (!tag) {
      return res.status(404).json({
        err: null,
        msg: 'This Tag is not found ',
        data: null
      });
    }

    return res.status(201).json({
      err: null,
      msg: 'Succesfully retrieved the Tag',
      data: tag
    });
  })
};

module.exports.findTagbyid = function (req, res, next) {
  Tag.findOne({ _id: req.params.tagId, blocked: { $eq: false } }).exec(function (err, tag) {
    if (err) {
      return next(err);
    }
    if (!tag) {
      return res.status(404).json({
        err: null,
        msg: 'This Tag is not found ',
        data: null
      });
    }

    return res.status(201).json({
      err: null,
      msg: 'Succesfully retrieved the Tag',
      data: tag
    });
  })
};