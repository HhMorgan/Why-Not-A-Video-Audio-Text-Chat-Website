import { Component, OnInit } from "@angular/core";
import { APIData, User, ReserveSlotBody, OfferSlotBody, ExpertAcceptSlotBody } from '../../@core/service/models/api.data.structure';
import { APIService } from "../../@core/service/api.service";
import * as moment from 'moment';
import { error } from "util";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './template/Schedule.component.html',
  styleUrls: ['./template/Schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  public mySchedule: boolean;
  public yourDate: Date = new Date();
  public weekduration: String;
  scheduleFlag: boolean = false;
  weekFlag: boolean = false;
  monthFlag: boolean = true;
  monthValue;
  oldWeekValue = 1;
  weekValue = 1;
  weekStart;
  weekEnd;
  rightArrow = false;
  leftArrow = false;
  role;
  usersRequestedSlot = [];
  public schedule: any[][] = [];
  daysOfTheWeek = ["Saturday", "Sunday", "Moday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  modifiedWeek = [];
  public popout = false;
  public popoutExpert = false;
  public lateSub = false;

  private id = "5ad0c0fbee0ffd38e0549a5a";

  constructor(private apiService: APIService, private route: ActivatedRoute) {
    var user = <User>{};
    this.route.params.subscribe(params => {
      if (!params.expertid) {
        user._id = this.id;
        this.mySchedule = true;
      } else {
        this.mySchedule = false;
        user._id = params.expertid;
      }
      this.apiService.getSchedule(user).subscribe((apiresponse: APIData) => {
        this.updateSchedule(apiresponse.data);
      })
    });
  }
  updateSchedule( scheduleSlots : any ){
    for (let slot of scheduleSlots) {
      this.schedule[slot.day][slot.time].offered = true;
      this.schedule[slot.day][slot.time].users = slot.users;
      this.schedule[slot.day][slot.time].status = slot.status;
    }
  }
  ngOnInit() {
    for (var i = 0; i < 7; i++) {
      this.schedule[i] = []
      for (var j = 0; j < 15; j++) {
        this.schedule[i][j] = { offered: false, users: [] , status : "Opened" };
      }
    }
    this.getData();
  }
  popoutOn() {
    this.popout = true;
  }
  popoutOff() {
    this.popout = false;
  }
  popoutExpertOn( day : Number , slot : any) {
    this.usersRequestedSlot = [];
    if (slot.users.length > 0) {
      for (let user of slot.users) {
        this.usersRequestedSlot.push( { id : user._id , username : user.username , day : day , slot : slot } );
      }
      console.log(this.usersRequestedSlot);
    } else {
      console.log("not here");
    }
    this.popoutExpert = true;
  }
  
  popoutExpertOff() {
    this.popoutExpert = false;
  }

  AcceptUser(userid: String , day : number , slot : any ) {
    this.apiService.expertAcceptSlot(<ExpertAcceptSlotBody> { userid : userid , 
      dayNo : JSON.stringify(day) , slotNo : JSON.stringify( this.schedule[day].indexOf(slot) ) } ).subscribe((apiresponse: APIData) => {
      console.log(apiresponse.msg)
      this.updateSchedule(apiresponse.data);
    }, (err) => {
      console.log(err);
    });
  }

  getData() {
    this.apiService.getUserData().subscribe((apires: APIData) => {
      this.role = apires.data.role;
      console.log(this.role);
    })
  }

  modifyWeekArray(val) {
    for (let i = 0; i < this.daysOfTheWeek.length; i++) {
      this.modifiedWeek.push(this.daysOfTheWeek[val]);
      val++;
      if (val == 7)
        val = 0;
    }
  }
  ifFifthWeek() {
    let day = ((4 - 1) * 7) + 1
    var dayTargeted = new Date(this.monthValue + " " + day + ", " + (new Date()).getFullYear() + " 10:00:00")
    var LastDay = new Date((new Date()).getFullYear(), this.getMonth() + 1, 0);
    var data = moment(dayTargeted).startOf('week').isoWeekday(6);
    data.add(6, 'd');
    if (LastDay.getDate != data.date)
      return true
    return false
  }
  onAdd() {
    if (this.rightArrow) {
      this.rightArrow = false
    }
    this.oldWeekValue = this.weekValue;
    this.weekValue++;
  }
  onSubtract() {
    if (this.leftArrow) {
      this.leftArrow = false
    }
    this.oldWeekValue = this.weekValue;
    this.weekValue--;
  }
  getMonth() {
    switch (this.monthValue) {
      case 'January': return 1;
      case 'February': return 2;
      case 'March': return 3;
      case 'April': return 4;
      case 'May': return 5;
      case 'June': return 6;
      case 'July': return 7;
      case 'Augest': return 8;
      case 'September': return 9;
      case 'October': return 10;
      case 'November': return 11;
      case 'December': return 12;
    }
  }
  getRange() {
    let day = ((this.weekValue - 1) * 7) + 1;
    if (day < -31) {
      this.rightArrow = true;
      day = -31;
      this.weekValue = this.oldWeekValue;
    }
    if (this.rightArrow) {
      day = -31;
    }
    if (day > 1) {
      this.leftArrow = true;
      day = 1;
      this.weekValue = this.oldWeekValue;
    }
    if (this.leftArrow) {
      day = 1;
    }

    //console.log("day : "+day);
    //console.log(this.yourDate);
    this.yourDate = new Date(this.monthValue + " " + day + ", " + (new Date()).getFullYear() + " 10:00:00")
    //console.log(this.yourDate)
    var data = moment(this.yourDate).startOf('week').isoWeekday(6);
    this.weekduration = "";
    //for (var i = 0 ; i < 2 ; i++) {
    this.weekStart = data.format('D-MMMM');
    //if(i != 1) {
    //  this.weekduration += " => "
    // }
    data.add(6, 'd');
    this.weekEnd = data.format('D-MMMM');
    //}
  }

  monthGetValue(val: any) {
    this.monthValue = val;
    console.log(this.monthValue);
    this.monthToWeek();
  }
  weekGetValue(val: any) {
    this.weekValue = val;
    console.log(this.weekValue);
    this.weekToSchedule();
  }

  monthToWeek() {
    this.monthFlag = false;
    //this.weekFlag=true;
    this.scheduleFlag = true;
  }

  weekToSchedule() {
    this.weekFlag = false;
    this.scheduleFlag = true;
  }

  weekToMonth() {
    this.monthFlag = true;
    this.weekFlag = false;
  }

  scheduleToWeek() {
    //this.weekFlag=true;
    this.weekValue = 1;
    this.rightArrow = false;
    this.leftArrow = false;
    console.log(this.weekValue);
    this.monthFlag = true;
    this.scheduleFlag = false;
  }

  Reserve(day, slot) {
    console.log("slot : " + this.schedule[day].indexOf(slot));
    this.apiService.userReserveSlot(<ReserveSlotBody>{ expertID: this.id, dayNo: JSON.stringify(day), slotNo: JSON.stringify(this.schedule[day].indexOf(slot)) }).subscribe((apiresponse: APIData) => {
      console.log(apiresponse.msg)
      this.updateSchedule(apiresponse.data);
    }, (err) => {
      console.log(err);
    });
    console.log(this.schedule[day].indexOf(slot))
  }
  //users
  Offer(day, slot) {
    // console.log(slot);
    this.apiService.expertOfferSlot(<OfferSlotBody>{ dayNo: JSON.stringify(day), slotNo: JSON.stringify(this.schedule[day].indexOf(slot)) }).subscribe((apiresponse: APIData) => {
      console.log(apiresponse.msg)
      this.updateSchedule(apiresponse.data);
    }, (err) => {
      console.log(err);
    });
    console.log(this.schedule[day].indexOf(slot))
  }
  book() {
    alert("Thank you. You will be notified with slots that suit the expert");
  }
}


