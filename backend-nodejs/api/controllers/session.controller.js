var mongoose = require('mongoose'),
jwt = require('jsonwebtoken'),
Validations = require('../utils/validations'),
User = mongoose.model('User'),
Session = mongoose.model('Session');

module.exports.createSession = function(req, res, next) {
    // Check that the body keys are in the expected format and the required fields are there
    var valid = req.body.userId && Validations.isObjectId(req.body.userId);
    if (!valid) {
      return res.status(422).json({
        err: null,
        msg: 'userId is Not Valid',
        data: null
      });
    } else {
        User.findById(req.body.userId).exec(function(err, user) {
            if (err) 
                return next(err);
            if(user){
                req.body.createdById = user._id;
                Session.create(req.body , function(err,session) {
                    if(err)
                        return next(err);
                    return res.status(201).json({
                        err: null,
                        msg: 'Session Created',
                        data: session.toObject()
                    });
                });
            } else {
                return res.status(404).json({
                    err: null,
                    msg: 'Unable to locate userWithId :' + req.body.userId,
                    data: null
                });
            }
        });
    }
};

module.exports.addCandidate = function(req, res, next) {
    // Check that the body keys are in the expected format and the required fields are there
    var valid = req.body.userId && Validations.isObjectId(req.body.userId) &&
    req.body.sessionId && Validations.isObjectId(req.body.sessionId) &&
     req.body.candidate && Validations.isObjectId(req.body.candidate);
    if (!valid) {
      return res.status(422).json({
        err: null,
        msg: 'userId | sessionId | candidate is Not Valid ',
        data: null
      });
    } else {
        Session.findOneAndUpdate({ $and : [ { createdById : { $eq : req.body.userId } } , { _id : { $eq : req.body.sessionId } } , 
           { candidates : { $not : { $elemMatch : { id : { $eq : req.body.candidate } } } } },
           { $expr : { $lt:[{$size : "$candidates"} , 5 ] } } ] } ,
           { $push: { candidates :{ id : req.body.candidate } } } , {new: true}
        ).exec(function(err, session) {
            if (err) 
                return next(err);
            if(session) {
                return res.status(201).json({
                    err: null ,
                    msg: 'Adding candidate to Session Completed Successfully' ,
                    data: session
                });
            } else {
                return res.status(409).json({
                    err: null ,
                    msg: 'Adding candidate to Session Failed' ,
                    data: null
                });
            }
        });
    }
};

module.exports.updateCandidate = function(req , res , next) {
    var valid = req.body.userId && Validations.isObjectId(req.body.userId) &&
    req.body.sessionId && Validations.isObjectId(req.body.sessionId) &&
    req.body.rtcDes && Validations.isString(req.body.rtcDes);
    if (!valid) {
        return res.status(422).json({
          err: null,
          msg: 'userId | sessionId | rtcDes is Not Valid ',
          data: null
        });
    } else {
        Session.findOneAndUpdate({
            $and : [
                { _id : { $eq : req.body.sessionId } },
                { candidates : { $elemMatch : { id : { $eq : req.body.userId } } } },
            ]},{ $set: { 
                "candidates.$.rtcDes" : req.body.rtcDes  } 
            } , {new: true}
        ).exec(function(err, session) {
            if(err)
                return next(err);
            if(session) {
                return res.status(201).json({
                    err: null ,
                    msg: 'Updating candidate Session Completed Successfully' ,
                    data: session
                });
            } else {
                return res.status(409).json({
                    err: null ,
                    msg: 'Updating candidate in Session Failed' ,
                    data: null
                });
            }
        });
    }
}

module.exports.getCandidatesRTCDes = function(req, res, next) {
    // Check that the body keys are in the expected format and the required fields are there
    var valid = req.params.sessionId && Validations.isObjectId(req.params.sessionId)
    && req.body.userId && Validations.isObjectId(req.body.userId)
    if (!valid) {
      return res.status(422).json({
        err: null,
        msg: 'sessionId | userId is Not Valid',
        data: null
      });
    } else {
        Session.aggregate([
            { $match : { "_id" : mongoose.Types.ObjectId(req.params.sessionId) } },{ 
                $project: {
                    _id : 0,
                    candidates : {
                        $filter : { input : "$candidates" , as : "candidate" , 
                            cond: {
                                $and : [
                                    { $ne : ["$$candidate.id", mongoose.Types.ObjectId(req.body.userId)] },
                                    { $in : [ mongoose.Types.ObjectId(req.body.userId) , "$candidates.id" ] }
                                ]
                            }
                        },
                    }
                },
            }]).exec(function(err, session) {
            if (err) 
                return next(err);
            if(session) {
                return res.status(200).json({
                    err: null,
                    msg: 'Candidates get RTC Desription Completed Sucessfully',
                    data: session
                });
            } else {
                return res.status(404).json({
                    err: null,
                    msg: 'Unable to locate session With Id :' + req.params.sessionId,
                    data: null
                });
            }
        });
    }
};

module.exports.testSession = function(req, res, next) {
    req.app.io.emit('tx' ,{key:'fuck'});
    return res.status(200).json({
        err: null,
        msg: 'Candidates get RTC Desription Completed Sucessfully',
        data: null
    })
};
