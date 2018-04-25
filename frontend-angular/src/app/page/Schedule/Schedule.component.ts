import {Component , OnInit} from "@angular/core";
import {APIData , User} from '../../@core/service/models/api.data.structure';
import { APIService  } from "../../@core/service/api.service";
import * as moment from 'moment';

@Component({
  selector: 'app-login',
  templateUrl: './template/Schedule.component.html',
  styleUrls: ['./template/Schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  public yourDate : Date = new Date();
  public weekduration : String ;
  scheduleFlag:boolean=false;
  weekFlag:boolean=false;
  monthFlag:boolean=true;
  monthValue;
  oldWeekValue=1;
  weekValue=1;
  numbers;
  randomNumber=0;
  randomFlag;
  weekStart;
  weekEnd;
  rightArrow=false;
  leftArrow=false;
  daysOfTheWeek=["Sunday","Moday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
  modifiedWeek=[]
  slots: String []=['Reserved']; 

  constructor(){


    // this.assignslots();
    
     }
  randomNumberGenerator(){
    this.randomNumber=Math.random();
   }
   randomChecker(val){
    this.randomNumberGenerator();
    if(val%this.randomNumber==0){
      this.randomFlag= true
      return true
   }
      this.randomFlag=false
      return false
   }

   
 ngOnInit() {
  this.numbers = Array(15).fill(0).map((x,i)=>i);
 }
 modifyWeekArray(val){
    for(let i=0;i<this.daysOfTheWeek.length;i++){
      this.modifiedWeek.push(this.daysOfTheWeek[val]);
      val++;
      if (val==7)
        val=0;
    }
 }
 ifFifthWeek(){
  let day= ((4-1)*7)+1
  var dayTargeted=new Date(this.monthValue +" "+day+", "+(new Date()).getFullYear()+" 10:00:00")
  var LastDay = new Date((new Date()).getFullYear(), this.getMonth() + 1, 0);
  var data = moment(dayTargeted).startOf('week').isoWeekday(6);
  data.add(6,'d');
  if(LastDay.getDate!=data.date)
    return true
  return false
 }
 onAdd(){
    if(this.rightArrow){
     this.rightArrow=false
   }
   this.oldWeekValue=this.weekValue;
  this.weekValue++;
 }
 onSubtract(){
   if(this.leftArrow){
    this.leftArrow=false
  }
  this.oldWeekValue=this.weekValue;
  this.weekValue--;
 }
getMonth(){
  switch(this.monthValue){
    case 'January' : return 1;
    case 'February' : return 2;
    case 'March' : return 3;
    case 'April' : return 4;
    case 'May' : return 5;
    case 'June' : return 6;
    case 'July' : return 7;
    case 'Augest' : return 8;
    case 'September' : return 9;
    case 'October' : return 10;
    case 'November' : return 11;
    case 'December' : return 12;
  }
}
getRange(){
  let day= ((this.weekValue-1)*7)+1;
  //console.log(this.weekValue+"//"+day);
 //console.log(this.rightArrow)
  if(day<-31){
    this.rightArrow=true;
    day=-31;
    this.weekValue=this.oldWeekValue;
  }
  if(this.rightArrow){
    day=-31;
  }
  if(day>1){
    this.leftArrow=true;
    day=1;
    this.weekValue=this.oldWeekValue;
  }
  if(this.leftArrow){
    day=1;
  }
  
  //console.log("day : "+day);
  //console.log(this.yourDate);
  this.yourDate=new Date(this.monthValue +" "+day+", "+(new Date()).getFullYear()+" 10:00:00")
  //console.log(this.yourDate)
  var data = moment(this.yourDate).startOf('week').isoWeekday(6);
  this.weekduration = "";
  //for (var i = 0 ; i < 2 ; i++) {
    this.weekStart = data.format('D-MMMM');
   //if(i != 1) {
  //  this.weekduration += " => "
  // }
   data.add(6,'d');
   this.weekEnd = data.format('D-MMMM');
  //}
}
addslot(day , hour) {
  this.slots[0]= 'Reserved';
  this.slots[100]='Reserved';
}

monthGetValue(val : any){
  this.monthValue=val;
  console.log(this.monthValue);
  this.monthToWeek();
}
weekGetValue(val : any){
  this.weekValue=val;
  console.log(this.weekValue);
  this.weekToSchedule();
}

monthToWeek(){
  this.monthFlag=false;
  //this.weekFlag=true;
  this.scheduleFlag=true;
}
weekToSchedule(){
  this.weekFlag=false;
  this.scheduleFlag=true;
}
weekToMonth(){
  this.monthFlag=true;
  this.weekFlag=false;
}
scheduleToWeek(){
  //this.weekFlag=true;
  this.weekValue=1;
  this.rightArrow=false;
  this.leftArrow=false;
  console.log(this.weekValue);
  this.monthFlag=true;
  this.scheduleFlag=false;
}

// assignslots(){
//   this.addslot(0,0);
// for( var i=0; i<30; i++){
//   for(var j=0; j<14; j++){
//  console.log(this.slots[(i*14)+j]);
//  if((this.slots[(i*14)+j] === 'Reserved' ) )
//   this.slots[(i*14)+j]= 'Reserved';
//   else
//   this.slots[(i*14)+j]= 'Reserve';

// }}
// }

Reserve(day , hour) {
var slot=(day*14)+hour;
console.log(this.slots[slot]);
if((this.slots[slot]==='Reserve')){
this.slots[slot] = 'Reserved'; 
console.log(this.slots[slot]);
alert("Your slot has been reserved, Thank you");
//window.location.href="/#/page/rating";
}
else
alert("This slot is already reserved , please choose another one ");
}

book(){
  alert("Thank you. You will be notified with slots that suit the expert");
}
}


