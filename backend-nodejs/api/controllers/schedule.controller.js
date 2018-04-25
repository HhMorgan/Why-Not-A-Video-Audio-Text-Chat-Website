var mongoose = require('mongoose'),
Request = mongoose.model('Request'),
Schedule = mongoose.model('Schedule'),
User = mongoose.model('User'),
Tag = mongoose.model('Tag'),
Slot = mongoose.model('ReservedSlot'),
Validations = require('../utils/validations'),
moment = require('moment');

module.exports.fuck = function(req, res, next) {

  var valid = req.body.expertID && Validations.isObjectId(req.body.expertID) &&
  req.body.dayNo && Validations.isNumber(req.body.dayNo) && 
  req.body.slotNo && Validations.isNumber(req.body.slotNo);
  if (!valid) {
    return res.status(422).json({
      err: null,
      msg: 'userId | dayNo | slotNo is Not Valid',
      data: null
    });
  } else {
    req.body.slots = { status : "pending" , day : req.body.dayNo , time : req.body.slotNo }
    delete req.body.dayNo
    delete req.body.slotNo
    Schedule.create( req.body , function(err,schedule) {
      console.log(schedule);
    })
  }
}

module.exports.fuck2 = function(req, res, next) {

  var valid = req.body.expertID && Validations.isObjectId(req.body.expertID) &&
  req.body.dayNo && Validations.isNumber(req.body.dayNo) && 
  req.body.slotNo && Validations.isNumber(req.body.slotNo) &&
  req.body.userid && Validations.isObjectId(req.body.userid)
  if (!valid) {
    return res.status(422).json({
      err: null,
      msg: 'userId | dayNo | slotNo | userid is Not Valid',
      data: null
    });
  } else {
      Schedule.findOneAndUpdate({ $and : [ { expertID : { $eq : req.body.expertID } } , /*{ reservedSlots : { $not : { $elemMatch : { users : { $eq : req.body.userid } } } } }*/ ]
      },{ $push : { reservedSlots : { users : req.body.userid  , day : req.body.dayNo , time : req.body.slotNo } } } , {new: true}).exec( function(err,schedule) {
        if (err) {
          return next(err);
        }
        console.log(schedule);
        return res.status(201).json(
          {
            err: null ,
            msg: 'Fuck2' ,
            data: schedule
          }
        )
      })
    }
}

module.exports.fuck3 = function(req, res, next) {

  var valid = req.body.expertID && Validations.isObjectId(req.body.expertID) &&
  req.body.dayNo && Validations.isNumber(req.body.dayNo) && 
  req.body.slotNo && Validations.isNumber(req.body.slotNo) &&
  req.body.userid && Validations.isObjectId(req.body.userid)
  if (!valid) {
    return res.status(422).json({
      err: null,
      msg: 'userId | dayNo | slotNo | userid is Not Valid',
      data: null
    });
  } else {
      Schedule.findOneAndUpdate({ $and : [ { expertID : { $eq : req.body.expertID } } , { slots : { $elemMatch : { day : { $eq : req.body.dayNo } , time : { $eq : req.body.slotNo } , users : { $ne : req.body.userid } } } } ]
      },{ $push : { "slots.$.users" : req.body.userid  } } , {new: true}).exec( function(err,schedule) {
        if (err) {
          return next(err);
        }
        console.log(schedule);
        return res.status(201).json(
          {
            err: null ,
            msg: 'Fuck2' ,
            data: schedule
          }
        )
      })
    }
}


