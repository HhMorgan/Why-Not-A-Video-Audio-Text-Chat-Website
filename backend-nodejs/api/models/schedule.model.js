var ScheduleHelper = require('../utils/schedule.helper'), 
mongoose = require('mongoose'),
moment = require('moment');

var ScheduleSchema = mongoose.Schema({
    expertID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    startDate: {
        type: String,
        required: true,
        default: ScheduleHelper.weekdayWithStartWeekday( Date.now() , 0 , 6 ).format('D-MMMM-YY')
    },
    endDate: {
        type: String,
        required: true,
        default: ScheduleHelper.weekdayWithStartWeekday( Date.now() , 6 , 6 ).format('D-MMMM-YY')
    },
    slots:[
        {
            users: [ { type: mongoose.Schema.Types.ObjectId , ref: 'User' , _id : false } ],
            day : Number,
            time : Number,
            session : {
                type: mongoose.Schema.Types.ObjectId , ref: 'Session',
            },
            status : String,
            _id: false ,
        }
    ]

}, { collection: 'Schedules' }
);

module.exports = mongoose.model('Schedule', ScheduleSchema);
