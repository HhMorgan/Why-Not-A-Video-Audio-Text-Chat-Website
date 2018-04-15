var mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  Validations = require('../utils/validations'),
  Tags = mongoose.model('Tag');
  User = mongoose.model('User');
 
  module.exports.AddTag = function(req, res, next) {
    var valid =
      req.body.name &&
      Validations.isString(req.body.name);
// check if the tag name is given    
      if (!valid) {
      return res.status(422).json({
        err: null,
        msg: 'name (String) is a required fields.',
        data: null
      });
    }  
// Security Check
//delete req.body.createdAt;
//delete req.body.updatedAt;
// the method below creates the requred Tag in the backend and returns 201 if successful
Tags.create(req.body, function(err, Tags) {
  if (err) {
    return next(err);
  }
  res.status(201).json({
    err: null,
    msg: 'Tag was added Sucessfully.',
    data: Tags
  });
});
};

module.exports.editTag = function(req, res, next) {
// below we chck if the Id given by the edit tag method exists 
  if (!Validations.isObjectId(req.params.tagId)) {
    return res.status(422).json({
      err: null,
      msg: 'TagId parameter must be a valid ObjectId.',
      data: null
    });
  }
  var valid =
    req.body.name &&
    Validations.isString(req.body.name) 
//then we check if the tag name is given as an input
    if (!valid) {
    return res.status(422).json({
      err: null,
      msg: 'name(String) is a required field.',
      data: null
    });
  }
  // Security Check
 //delete req.body.createdAt;
  //req.body.updatedAt = moment().toDate();
// this method finds the Tag in the backend using the given Id and updates it's data
// to match that of the input's and returns 200 is sucessfull
  Tags.findByIdAndUpdate(
    req.params.tagId,
    {
      $set: req.body
    },
    { new: true }
  ).exec(function(err, updatedTag) {
    if (err) {
      return next(err);
    }
    if (!updatedTag) {
      return res
        .status(404)
        .json({ err: null, msg: 'Tag not found.', data: null });
    }
    res.status(200).json({
      err: null,
      msg: 'Tag was updated successfully.',
      data: updatedTag
    });
  });
};

//this method retreives all the tags from the backend and returns them in an array
// of tags
module.exports.getTags = function(req, res, next) {
  Tags.find({}).exec(function(err, tag) {
    if (err) {
      return next(err);
    }
    res.status(200).json({
      err: null,
      msg: 'Tags retrieved successfully.',
      data: tag
    });
  });
};
module.exports.deleteTags = function(req, res, next) {
  //checks if the tag Id exists
  if (!Validations.isObjectId(req.params.tagId)) {
    return res.status(422).json({
      err: null,
      msg: 'TagId parameter must be a valid ObjectId.',
      data: null
    });
  }
// this method finds the tag by the Id given as input and removes it from the database
  Tags.findByIdAndRemove(req.params.tagId,function(
    err,
    deletedTags
  ) {
    if (err) {
      return next(err);
    }
    if (!deletedTags) {
      return res
        .status(404)
        .json({ err: null, msg: 'Tag not found.', data: null });
    }
    res.status(200).json({
      err: null,
      msg: 'Tag was deleted successfully.',
      data: deletedTags
    });
  });
};

module.exports.blockUser = function(req, res, next) {
  if (!Validations.isObjectId(req.params.userId)) {
    return res.status(422).json({
      err: null,
      msg: 'userId parameter must be a valid ObjectId.',
      data: null
    });
  }
  
  User.findByIdAndUpdate(
    req.params.userId,
    {
      $set: {blocked: true}
    },
    { new: true }
  ).exec(function(err, blockeduser) {
    if (err) {
      return next(err);
    }
    if (!blockeduser) {
      return res
        .status(404)
        .json({ err: null, msg: 'User not found.', data: null });
    }
    res.status(200).json({
      err: null,
      msg: 'User was blocked successfully.',
      data: blockeduser
    });
  });
};

module.exports.downgradeExpertToUser = function(req, res, next) {
  if (!Validations.isObjectId(req.params.userId)) {
    return res.status(422).json({
      err: null,
      msg: 'userId parameter must be a valid ObjectId.',
      data: null
    });
  }
  
  User.findByIdAndUpdate(
    req.params.userId,
    {
      $set: {role: 'regular'}
    },
    { new: true }
  ).exec(function(err, blockeduser) {
    if (err) {
      return next(err);
    }
    if (!blockeduser) {
      return res
        .status(404)
        .json({ err: null, msg: 'User not found.', data: null });
    }
    res.status(200).json({
      err: null ,
      msg: 'User was downgraded successfully.',
      data: { _id : blockeduser._id , username : blockeduser.username , role : blockeduser.role }
    });
  });
};

module.exports.getUsers = function(req, res, next) {
  User.find({} , { _id : 1 , username : 1 , email : 1  , role : 1 , blocked : 1 } ).exec(function(err, user) {
    if (err) {
      return next(err);
    }
    res.status(200).json({
      err: null,
      msg: 'Users retrieved successfully.',
      data: user
    });
  });
};

