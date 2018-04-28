var moment = require('moment');
module.exports.weekdayWithStartWeekday = function (targetWeekday, startDayOfWeek) {
    var weekday = ( moment(Date.now()).day() + 7 - startDayOfWeek ) % 7;
    return  moment(Date.now()).add(targetWeekday - weekday , "d", );
}

module.exports.getSlotIndex = function ( slots , day , time ){
    for(var i = 0 ; i < slots.length ; i++ ){
      if(slots[i].day == day && slots[i].time == time ){
        return i;
      }
    }
}