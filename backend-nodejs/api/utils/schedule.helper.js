var moment = require('moment');
module.exports.weekdayWithStartWeekday = function ( date , targetWeekday, startDayOfWeek) {
    var weekday = ( moment(date).day() + 7 - startDayOfWeek ) % 7;
    return  moment(date).add(targetWeekday - weekday , "d", );
}

module.exports.getSlotIndex = function ( slots , day , time ){
    for(var i = 0 ; i < slots.length ; i++ ){
      if(slots[i].day == day && slots[i].time == time ){
        return i;
      }
    }
}