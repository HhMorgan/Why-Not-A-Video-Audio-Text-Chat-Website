var mongoose = require('mongoose'),
Request = mongoose.model('Request'),
Schedule = mongoose.model('Schedule'),
User = mongoose.model('User'),
Tag = mongoose.model('Tag'),
Session = mongoose.model('Session'),
Slot = mongoose.model('ReservedSlot'),
Validations = require('../utils/validations'),
moment = require('moment');

function getSlotIndex( slots , day , time ){
  for(var i = 0 ; i < slots.length ; i++ ){
    if(slots[i].day == day && slots[i].time == time ){
      return i;
    }
  }
}

module.exports.getSlots = function(req , res , next){
  var valid = req.params.expertID && Validations.isObjectId(req.params.expertID)

  if(!valid){
    return res.status(422).json({
      err: null,
      msg: 'expertID is Not Valid',
      data: null
    });
  } else {
    var start_date = moment(new Date()).startOf('week').isoWeekday(6).format('D-MMMM-YY')
    var end_date = moment(new Date()).startOf('week').isoWeekday(6 + 6).format('D-MMMM-YY')
    Schedule.findOne({ $and : [ { expertID : { $eq : req.params.expertID } , startDate : { $eq : start_date } , endDate : { $eq : end_date } } ] }).exec(function( err,schedule ){
      if(schedule){
        return res.status(200).json({
          err: null,
          msg: 'Schedule Slots',
          data: schedule.slots
        });
      } else {
        return res.status(404).json({
          err: null,
          msg: 'Schedule Not Found',
          data: null
        });
      }
    })
  }
}

module.exports.expertOfferSlot = function(req, res, next) {

  var valid = req.decodedToken.user._id && Validations.isObjectId(req.decodedToken.user._id) &&
  req.body.dayNo && Validations.isNumber(req.body.dayNo) && 
  req.body.slotNo && Validations.isNumber(req.body.slotNo);
  if (!valid) {
    return res.status(422).json({
      err: null,
      msg: 'userId | dayNo | slotNo is Not Valid',
      data: null
    });
  } else {
    req.body.expertID = req.decodedToken.user._id;
    req.body.slots = { day : req.body.dayNo , time : req.body.slotNo }
    delete req.body.dayNo
    delete req.body.slotNo
    var start_date = moment(new Date()).startOf('week').isoWeekday(6).format('D-MMMM-YY')
    var end_date = moment(new Date()).startOf('week').isoWeekday(6 + 6).format('D-MMMM-YY')
    Schedule.findOneAndUpdate( { $and : [ { expertID : { $eq : req.decodedToken.user._id } , startDate : { $eq : start_date } , endDate : { $eq : end_date } , slots : { $not : { $elemMatch : { day : { $eq : req.body.slots.day } , time : { $eq : req.body.slots.time } } } } } ] } , { $push : { slots : req.body.slots } } , { new : true } ).exec(function( err , updatedSchedule ) {
      if(updatedSchedule) {
        return res.status(201).json({
          err: null ,
          msg: 'Slot Created Sucessfully',
          data: updatedSchedule
        });
      } else {
        Schedule.findOne({ $and : [ { expertID : { $eq : req.decodedToken.user._id } , startDate : { $eq : start_date } , endDate : { $eq : end_date } } ] }).exec(function( err , schedule ){
          if(schedule) {
            return res.status(403).json({
              err: null ,
              msg: 'Slot Creation Failed',
              data: schedule
            });
          } else {
            Schedule.create( req.body , function( err , createdSchedule ) {
              return res.status(201).json({
                err: null ,
                msg: 'Schedule & Slot Created Successfuly',
                data: createdSchedule
              });
            })
          }
        })
      }
    })
  }
}

module.exports.expertAcceptUserInSlot = function(req, res, next) {

  var valid = req.decodedToken.user._id && Validations.isObjectId(req.decodedToken.user._id) &&
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
    var start_date = moment(new Date()).startOf('week').isoWeekday(6).format('D-MMMM-YY')
    var end_date = moment(new Date()).startOf('week').isoWeekday(6 + 6).format('D-MMMM-YY')
    Schedule.findOneAndUpdate({ $and : [ { expertID : { $eq : req.decodedToken.user._id } , startDate : { $eq : start_date } , endDate : { $eq : end_date } , slots : { $elemMatch : { day : { $eq : req.body.dayNo } , time : { $eq : req.body.slotNo } , users : { $eq : req.body.userid } } } } ]
    },{ $pull : { "slots.$.users" : req.body.userid  } } , { new: true }).exec( function( err , schedule ) {
      if (err) {
        return next(err);
      }
      if(schedule){
        var scheduleSession = schedule.slots[ getSlotIndex( schedule.slots , req.body.dayNo , req.body.slotNo ) ].session;
        if(!scheduleSession){
          Session.create( { createdById : req.decodedToken.user._id , users : [ req.body.userid ] } , function(err , session) {
            if (err) {
              return next(err);
            }
            if(session){
              Schedule.findOneAndUpdate(  { _id : schedule._id , slots : { $elemMatch : { day : { $eq : req.body.dayNo } , time : { $eq : req.body.slotNo } } } } , { $set : { "slots.$.session" : session._id } } , { new : true }).exec( function( err , scheduleSessionUpdated ) {
                if (err) {
                  return next(err);
                }
                if(scheduleSessionUpdated){
                  return res.status(201).json({
                    err: null,
                    msg: 'Session '+ session._id + " Added",
                    data: scheduleSessionUpdated
                  })
                } else {
                  return res.status(403).json({
                    err: null,
                    msg: 'Failed to Add Session '+ session._id ,
                    data: null
                  })
                }
              })
            } else {
              return res.status(403).json({
                err: null,
                msg: 'Failed to Create Session',
                data: null
              })
            }
          })
        } else {
          Session.findOneAndUpdate( { _id : scheduleSession , users : { $ne : req.body.userid } , $expr : { $lt:[ { $size : "$users" } , 1 ] }  } , 
            { $push : { users : req.body.userid } } , { new : true } ).exec( function( err , updatedSession ) {
            if (err) {
              return next(err);
            }
            if(updatedSession){
              return res.status(201).json({
                  err: null,
                  msg: 'Session New User Added',
                  data: schedule
              })
            } else {
              return res.status(403).json({
                err: null,
                msg: 'Session Failed to Add New User',
                data: null
              })
            }
          })
        }
      } else {
        return res.status(201).json(
          {
            err: null ,
            msg: 'Fuck2' ,
            data: schedule
          }
        )
      }
    })
  }
}

module.exports.userReserveSlot = function(req, res, next) {
  var valid = req.body.expertID && Validations.isObjectId(req.body.expertID) &&
  req.body.dayNo && Validations.isNumber(req.body.dayNo) && 
  req.body.slotNo && Validations.isNumber(req.body.slotNo) &&
  req.decodedToken.user._id && Validations.isObjectId(req.decodedToken.user._id)
  console.log(valid);
  console.log(req.body);

  if (!valid) {
    return res.status(422).json({
      err: null,
      msg: 'userId | dayNo | slotNo is Not Valid',
      data: null
    });
  } else {
      Schedule.findOneAndUpdate({ $and : [ { expertID : { $eq : req.body.expertID } } , { slots : { $elemMatch : { day : { $eq : req.body.dayNo } , time : { $eq : req.body.slotNo } , users : { $ne : req.decodedToken.user._id } } } } ]
      },{ $push : { "slots.$.users" : req.decodedToken.user._id } } , {new: true}).exec( function( err , schedule ) {
        if (err) {
          return next(err);
        }
        if(schedule){
          return res.status(201).json(
            {
              err: null ,
              msg: 'Reserved Slot Successfully' ,
              data: null
            }
          )
        } else {
          return res.status(403).json(
            {
              err: null ,
              msg: 'Failed To Reserve Slot' ,
              data: null
            }
          )
        }
      })
  }
}


