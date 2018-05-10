/* 
this controller contains all the functions related to the schedule schema as
1- expert view his defined slots
2- expert add new slot to his schedule
3- expert cancel an offered slot
4- expert accept a session request from user
5- user send a slot request to expert 
*/
var mongoose = require('mongoose'),
Request = mongoose.model('Request'),
Schedule = mongoose.model('Schedule'),
User = mongoose.model('User'),
Tag = mongoose.model('Tag'),
Session = mongoose.model('Session'),
NotificationController = require('../controllers/notification.controller'),
Validations = require('../utils/validations'),
ScheduleHelper = require('../utils/schedule.helper'),
moment = require('moment');

/*
this function retreives all the slots defined by the expert from table Schedule 
*/
module.exports.getSlots = function(req , res , next){
  var valid = req.params.expertID && Validations.isObjectId(req.params.expertID)
  if(!valid){
    return res.status(422).json({
      err: null,
      msg: 'expertID is Not Valid',
      data: null
    });
  } else {
    var start_date = ScheduleHelper.weekdayWithStartWeekday( Date.now() , 0 , 6 ).format('D-MMMM-YY')
    var end_date = ScheduleHelper.weekdayWithStartWeekday( Date.now() , 6 , 6 ).format('D-MMMM-YY')
    Schedule.findOne({ $and : [ { expertID : { $eq : req.params.expertID } , 
      startDate : { $eq : start_date } , endDate : { $eq : end_date } } ] }).
      populate('slots.users','username').exec(function( err,schedule ){
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

module.exports.getWeeklySlots = function(req , res , next ){
  var valid = req.decodedToken.user._id && Validations.isObjectId(req.decodedToken.user._id) &&
  req.body.date && moment(Date.parse(req.body.date)).isValid();
  if(!valid){
    return res.status(422).json({
      err: null,
      msg: 'expertID | date is Not Valid',
      data: null
    });
  } else {
    var start_date = ScheduleHelper.weekdayWithStartWeekday( moment(Date.parse(req.body.date)).toDate() , 0 , 6 ).format('D-MMMM-YY')
    var end_date = ScheduleHelper.weekdayWithStartWeekday( moment(Date.parse(req.body.date)).toDate() , 6 , 6 ).format('D-MMMM-YY')
    Schedule.findOne({ $and : [ { expertID : { $eq : req.decodedToken.user._id } , 
      startDate : { $eq : start_date } , endDate : { $eq : end_date } } ] }).
      populate('slots.users','username').exec(function( err,schedule ){
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

/*
this function adds new slots to the expert's Schedule if the schedule already exists,
if not it creats a new Schedule to the expert and add the offered slot in it 
*/
module.exports.expertOfferSlot = function(req, res, next) {
   //Validate the userId, day and slot number
  var valid = req.decodedToken.user._id && Validations.isObjectId(req.decodedToken.user._id) &&
  req.body.dayNo && Validations.isNumber(req.body.dayNo) && 
  req.body.slotNo && Validations.isNumber(req.body.slotNo) && 
  req.body.date && moment(Date.parse(req.body.date)).isValid();
  if (!valid) {
    return res.status(422).json({
      err: null,
      msg: 'userId | dayNo | slotNo | date is Not Valid',
      data: null
    });
  } else {
    req.body.slots = { day : req.body.dayNo , time : req.body.slotNo , status : "Opened" }
    delete req.body.dayNo
    delete req.body.slotNo
    var start_date = ScheduleHelper.weekdayWithStartWeekday( moment(Date.parse(req.body.date)).toDate() , 0 , 6 ).format('D-MMMM-YY')
    var end_date = ScheduleHelper.weekdayWithStartWeekday( moment(Date.parse(req.body.date)).toDate() , 6 , 6 ).format('D-MMMM-YY')
    /*find a record with same expertID, day, slotNo within week of start_date and end_date
       and does not match any slot existing in the schedule table, also update the schedule with the new slot added.*/
    Schedule.findOneAndUpdate( { $and : [ { expertID : { $eq : req.decodedToken.user._id } , startDate : { $eq : start_date } , 
      endDate : { $eq : end_date } , slots : { $not : { $elemMatch : { day : { $eq : req.body.slots.day } , time : { $eq : req.body.slots.time } } } } } ] } , 
      { $push : { slots : req.body.slots } } , { new : true } ).populate('slots.users','username').exec(function( err , updatedSchedule ) {
      if(updatedSchedule) {
        return res.status(201).json({
          err: null ,
          msg: 'Slot Created Sucessfully',
          data: updatedSchedule.slots
        });
      } else {
        /*if there is no existing schedule for the expert, create a new schedule and add the new slot to it*/
        Schedule.findOne({ $and : [ { expertID : { $eq : req.decodedToken.user._id } , startDate : { $eq : start_date } , endDate : { $eq : end_date } } ] })
        .populate('slots.users','username').exec(function( err , schedule ){
          if(schedule) {
            return res.status(403).json({
              err: null ,
              msg: 'Slot Creation Failed',
              data: schedule.slots
            });
          } else {
            Schedule.create( { expertID : req.decodedToken.user._id , 
              startDate : start_date , endDate : end_date , slots : req.body.slots } , function( err , createdSchedule ) {
              return res.status(201).json({
                err: null ,
                msg: 'Schedule & Slot Created Successfuly',
                data: createdSchedule.slots
              });
            })
          }
        })
      }
    })
  }
}

module.exports.expertCancelSlot = function(req, res, next) {
   //Validate the userId, day and slot number
  var valid = req.decodedToken.user._id && Validations.isObjectId(req.decodedToken.user._id) &&
  req.body.dayNo && Validations.isNumber(req.body.dayNo) && 
  req.body.slotNo && Validations.isNumber(req.body.slotNo)  && 
  req.body.date && moment(Date.parse(req.body.date)).isValid();
  if (!valid) {
    return res.status(422).json({
      err: null,
      msg: 'userId | dayNo | slotNo | date is Not Valid',
      data: null
    });
  } else {
    req.body.slots = { day : req.body.dayNo , time : req.body.slotNo }
    var start_date = ScheduleHelper.weekdayWithStartWeekday( moment(Date.parse(req.body.date)).toDate() , 0 , 6 ).format('D-MMMM-YY')
    var end_date = ScheduleHelper.weekdayWithStartWeekday( moment(Date.parse(req.body.date)).toDate() , 6 , 6 ).format('D-MMMM-YY')
    Schedule.findOneAndUpdate( { $and : [ { expertID : { $eq : req.decodedToken.user._id } , startDate : { $eq : start_date } , endDate : { $eq : end_date } , 
      slots : { $elemMatch : { day : { $eq : req.body.slots.day } , time : { $eq : req.body.slots.time } , status : { $eq : "Opened" } } } } ] } , 
      { $pull : { slots : req.body.slots } } ).populate('slots.users','username').exec(function( err , updatedSchedule ) {
      if(updatedSchedule){
        var scheduleSlotUsers = updatedSchedule.slots[ ScheduleHelper.getSlotIndex( updatedSchedule.slots , req.body.dayNo , req.body.slotNo ) ].users ;
        NotificationController.createNotificationMuitiple( req.decodedToken.user._id , scheduleSlotUsers  , " Cancelled The Slot" , "Slot-Canceled" , 0 , function(done) {
          updatedSchedule.slots.splice( ScheduleHelper.getSlotIndex( updatedSchedule.slots , req.body.dayNo , req.body.slotNo ) , 1)
          return res.status(200).json({
            err: null,
            msg: 'Slot Canceled Successfuly',
            data: updatedSchedule.slots
          })
        })
      } else {
        return res.status(404).json({
          err: null,
          msg: 'Slot Does not Exist',
          data: null
        });
      }
    })
  }
}

module.exports.expertAcceptUserInSlot = function(req, res, next) {
 //Validate the userId, day and slot number
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
  } else { /* Userid != ExpertId Check */
    var start_date = ScheduleHelper.weekdayWithStartWeekday( Date.now() , 0 , 6 ).format('D-MMMM-YY')
    var end_date = ScheduleHelper.weekdayWithStartWeekday( Date.now() , 6 , 6 ).format('D-MMMM-YY')
    /*find a record with same expertID, day, slotNo within week of start_date and end_date
       and populates the usernames of requesting users. It also removes the userid from slots.users array 
       to accept the user.*/
    Schedule.findOneAndUpdate({ $and : [ { expertID : { $eq : req.decodedToken.user._id } ,
       startDate : { $eq : start_date } , endDate : { $eq : end_date } , 
      slots : { $elemMatch : { day : { $eq : req.body.dayNo } , time : { $eq : req.body.slotNo } , 
      users : { $eq : req.body.userid } , status : { $eq : "Opened" } } } } ]
    },{ $pull : { "slots.$.users" : req.body.userid  } } , 
    { new: true }).populate('slots.users','username').exec( function( err , schedule ) {
      if (err) {
        return next(err);
      }
      if(schedule){
        var scheduleSession = schedule.slots[ ScheduleHelper.getSlotIndex( schedule.slots , req.body.dayNo , req.body.slotNo ) ].session;
        //Checks to see if session already created
        if(!scheduleSession){
          //session is not created so you can accept the user and create a new session
          Session.create( { createdById : req.decodedToken.user._id , users : [ req.body.userid ] } ,
             function(err , session) {
            if (err) {
              return next(err);
            }
            if(session){
              // Successfully created session so we need to update the same schedule record with session id
              Schedule.findOneAndUpdate(  { _id : schedule._id , slots : { $elemMatch : { day : { $eq : req.body.dayNo } ,
                 time : { $eq : req.body.slotNo } , status : { $eq : "Opened" } } } } , 
                { $set : { "slots.$.session" : session._id } } , 
                { new : true }).populate('slots.users','username').exec( function( err , scheduleSessionUpdated ) {
                if (err) {
                  return next(err);
                }
                if(scheduleSessionUpdated){
                  //Sends notification to user with url of session 
                  NotificationController.createNotification( req.decodedToken.user._id , req.body.userid  ,
                     "url/" + session._id , "Session" , function(done) {
                    if(done){
                      return res.status(201).json({
                        err: null,
                        msg: 'Session '+ session._id + " Added",
                        data: scheduleSessionUpdated.slots
                      })
                    }
                  })
                } else {
                  //failed to send notification
                  return res.status(403).json({
                    err: null,
                    msg: 'Failed to Add Session '+ session._id ,
                    data: null
                  })
                }
              })
            } else {
              //failed to create a new session
              return res.status(403).json({
                err: null,
                msg: 'Failed to Create Session',
                data: null
              })
            }
          })
        } else {
          //a user already has been accepted in the session so the expert can't accept another one
          var maxNoUsers = 2;
          Session.findOneAndUpdate( { _id : scheduleSession , users : { $ne : req.body.userid } , 
            $expr : { $lt:[ { $size : "$users" } , maxNoUsers ] }  } , 
            { $push : { users : req.body.userid } } , 
            { new : true } ).populate('slots.users','username').exec( function( err , updatedSession ) {
            if (err) {
              return next(err);
            }
            if(updatedSession){
              NotificationController.createNotification( req.decodedToken.user._id , req.body.userid  , "url/ " + updatedSession._id , "Session" , function(done) {
                if(done){
                  if(updatedSession.users.length >= maxNoUsers) {
                    // number of users in session reached the max so a notification is sent to user rejecting his request
                    var scheduleSlotUsers = schedule.slots[ ScheduleHelper.getSlotIndex( schedule.slots , req.body.dayNo , 
                      req.body.slotNo ) ].users ;
                    NotificationController.createNotificationMuitiple( req.decodedToken.user._id , scheduleSlotUsers  , 
                      " Rejected The Slot" , "Slot-Denied" , 0 , function(done) {
                        if(done){
                          req.body.slots = { day : req.body.dayNo , time : req.body.slotNo }
                          //closes the slot and removes all the requesting users
                          Schedule.findOneAndUpdate({ $and : [ { _id : schedule._id , 
                            slots : { $elemMatch : { day : { $eq : req.body.slots.day } ,
                             time : { $eq : req.body.slots.time } , status : { $eq : "Opened" } } } } ] } , 
                            { $set : { "slots.$.users" : [] , "slots.$.status" : "Closed" } } , { new : true } ).populate('slots.users','username').exec(
                            function( err , updatedSchedule ) {
                              return res.status(200).json({
                                err: null,
                                msg: 'Session New User Added',
                                data: updatedSchedule.slots
                              })
                            }
                          )
                         
                        }
                      })
                  } else {
                    return res.status(201).json({
                      err: null,
                      msg: 'Session New User Added',
                      data: schedule.slots
                    })
                  }
                }
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
            msg: 'Schedule Not Found' , //AKA Nice Try LUL
            data: null
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

  if (!valid) {
    return res.status(422).json({
      err: null,
      msg: 'userId | dayNo | slotNo is Not Valid',
      data: null
    });
  } else {
    var start_date = ScheduleHelper.weekdayWithStartWeekday( Date.now() , 0 , 6 ).format('D-MMMM-YY')
    var end_date = ScheduleHelper.weekdayWithStartWeekday( Date.now() , 6 , 6 ).format('D-MMMM-YY')
    Schedule.findOneAndUpdate({ $and : [ { expertID : { $eq : req.body.expertID } } , { startDate : { $eq : start_date } } , 
      { endDate : { $eq : end_date } } , { slots : { $elemMatch : { day : { $eq : req.body.dayNo } , time : { $eq : req.body.slotNo } , status : { $eq : "Opened" } , users : { $ne : req.decodedToken.user._id } } } } ]
    },{ $push : { "slots.$.users" : req.decodedToken.user._id } } , {new: true}).populate('slots.users','username').exec( function( err , schedule ) {
      if (err) {
        return next(err);
      }
      if(schedule){
        NotificationController.createNotification( req.decodedToken.user._id , req.body.expertID  , " Requested A Slot With" , "Slot-Request" , function(done) {
          if(done){
            return res.status(201).json(
              {
                err: null ,
                msg: 'Reserved Slot Successfully' ,
                data: schedule.slots
              }
            )
          }
        })
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

module.exports.userUnReserveSlot = function(req, res, next) {
  var valid = req.body.expertID && Validations.isObjectId(req.body.expertID) &&
  req.body.dayNo && Validations.isNumber(req.body.dayNo) && 
  req.body.slotNo && Validations.isNumber(req.body.slotNo) &&
  req.decodedToken.user._id && Validations.isObjectId(req.decodedToken.user._id)
  if (!valid) {
    return res.status(422).json({
      err: null,
      msg: 'userId | dayNo | slotNo is Not Valid',
      data: null
    });
  } else {
    var start_date = ScheduleHelper.weekdayWithStartWeekday( Date.now() , 0 , 6 ).format('D-MMMM-YY')
    var end_date = ScheduleHelper.weekdayWithStartWeekday( Date.now() , 6 , 6 ).format('D-MMMM-YY')
    Schedule.findOneAndUpdate({ $and : [ { expertID : { $eq : req.body.expertID } } , { startDate : { $eq : start_date } } , 
      { endDate : { $eq : end_date } } , { slots : { $elemMatch : { day : { $eq : req.body.dayNo } , time : { $eq : req.body.slotNo } , status : { $eq : "Opened" } , users : { $eq : req.decodedToken.user._id } } } } ]
    },{ $pull : { "slots.$.users" : req.decodedToken.user._id } } , { new: true } ).populate('slots.users','username').exec( function( err , schedule ) {
      if (err) {
        return next(err);
      }
      if(schedule){
        NotificationController.createNotification( req.decodedToken.user._id , req.body.expertID  , " Cancelled A Slot Request With" , "Slot-Request" , function(done) {
          if(done){
            return res.status(201).json(
              {
                err: null ,
                msg: 'UnReserved Slot Successfully' ,
                data: schedule.slots
              }
            )
          }
        })
      } else {
        return res.status(403).json(
          {
            err: null ,
            msg: 'Failed To UnReserved Slot' ,
            data: null
          }
        )
      }
    })
  }
}