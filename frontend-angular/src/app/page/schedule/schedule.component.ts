import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { APIData, User, Token, ReserveSlotBody, SlotBody , SlotDateBody , ExpertAcceptSlotBody } from '../../@core/service/models/api.data.structure';
import { APIService } from "../../@core/service/api.service";
import * as moment from 'moment';
import { error } from "util";
import { ActivatedRoute } from "@angular/router";
import { SharedFunctions, SharedService } from "../../@core/service/shared.service";

@Component({
  selector: 'app-schedule',
  templateUrl: './template/schedule.component.html',
  styleUrls: ['./template/schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  public mySchedule: boolean;
  public yourDate: Date = new Date();

  public userView = false;
  public weekFlag: boolean = false;
  public monthFlag: boolean = false;
  public scheduleFlag: boolean = true;

  public weekStart;
  public weekEnd;
  public selectedWeek = 0;
  public weekduration: any[] = [];

  public usersRequestedSlot = [];
  public schedule: any[][] = [];

  public dayOffer;
  public slotOffer;
  public popout = false;
  public popoutExpert = false;
  public popoutExpertConfirmation = false;
  public popoutUserConfirmation = false;

  private expertUser = <User>{};

  constructor(private apiService: APIService , private sharedService: SharedService , private route: ActivatedRoute) {
    var userToken = <Token>this.apiService.getToken(true);
    this.route.params.subscribe(params => {
      if (!params.expertid) {
        this.mySchedule = true;
        this.expertUser._id = userToken._id;
        this.expertUser.role = userToken.role;
      } else {
        this.userView = true;
        this.monthFlag = false;
        this.mySchedule = false;
        this.scheduleFlag = true;
        this.expertUser._id = params.expertid;
      }
      this.weekduration.push(
        {
          weekStart: SharedFunctions.weekdayWithStartWeekday(new Date(), 0, 6).format('D-MMMM-YYYY'),
          WeekEnd: SharedFunctions.weekdayWithStartWeekday(new Date(), 6, 6).format('D-MMMM-YYYY')
        }
      )
      this.apiService.getSchedule(this.expertUser).subscribe((apiresponse: APIData) => {
        this.updateSchedule(apiresponse.data);
      },(err) =>{
        this.sharedService.triggerNotifcation("#EA4335", err.msg);
      })
    });
  }

  mobile() {
    var height = (window.screen.height);
    if (height <= 850) {
      return true;
    }
    return false;
  }

  updateSchedule(scheduleSlots: any) {
    this.scheduleReset();
    for (let slot of scheduleSlots) {
      this.schedule[slot.day][slot.time].offered = true;
      this.schedule[slot.day][slot.time].users = slot.users;
      this.schedule[slot.day][slot.time].status = slot.status;
    }
  }

  ngOnInit() {
    var height = (window.screen.height);
    if (height <= 750) {
      this.scheduleFlag = true;
      this.monthFlag = false;
    }
    this.scheduleReset();
  }

  popoutOn() {
    this.popout = true;
  }

  popoutOff() {
    this.popout = false;
  }

  popoutExpertOn(day: Number, slot: any) {
    if (!this.popoutExpertConfirmation) {
      this.dayOffer = day;
      this.slotOffer = slot;
      this.usersRequestedSlot = [];
      if (slot.users.length > 0) {
        for (let user of slot.users) {
          this.usersRequestedSlot.push({ id: user._id, username: user.username, day: day, slot: slot });
        }
        console.log(this.usersRequestedSlot);
      } else {
        // console.log("not here");
      }
      this.popoutExpert = true;
    }
  }

  popoutExpertOff() {
    this.popoutExpert = false;
  }

  popoutExpertConfirmationOn(day, slot) {
    if (!this.popoutExpert) {
      this.slotOffer = slot;
      this.dayOffer = day;
      this.popoutExpertConfirmation = true;
    }
  }

  popoutExpertConfirmationOff() {
    this.popoutExpertConfirmation = false;
  }

  popoutUserConfirmationOn(day, slot) {
    this.slotOffer = slot;
    this.dayOffer = day;
    this.popoutUserConfirmation = true;
  }

  popoutUserConfirmationOff() {
    this.popoutUserConfirmation = false;
  }

  AcceptUser(userid: String, day: number, slot: any) {
    this.apiService.expertAcceptSlot(<ExpertAcceptSlotBody>{
      userid: userid,
      dayNo: JSON.stringify(day), slotNo: JSON.stringify(this.schedule[day].indexOf(slot))
    }).subscribe((apiresponse: APIData) => {
      console.log(apiresponse.msg)
      this.updateSchedule(apiresponse.data);
    }, (err) => {
      this.sharedService.triggerNotifcation("#EA4335", err.msg);
    });
    this.popoutExpert=false;
  }

  operation(direction: String) {
    switch (direction) {
      case "Left":
        if (this.selectedWeek - 1 < 0) {
          //hide left
        } else {
          this.selectedWeek--;
          this.getWeeklySlots(this.weekduration[this.selectedWeek].weekStart);
        }
        break;
      case "Right":
        if (this.selectedWeek + 1 >= this.weekduration.length) {
          //hide right
        } else {
          this.selectedWeek++;
          this.getWeeklySlots(this.weekduration[this.selectedWeek].weekStart);
        }
        break;
    }
  }

  scheduleReset() {
    for (var i = 0; i < 7; i++) {
      this.schedule[i] = []
      for (var j = 0; j < 15; j++) {
        this.schedule[i][j] = { offered: false, users: [], status: "Opened" };
      }
    }
  }

  getWeeklySlots(date) {
    this.apiService.getScheduleWeeklySlots(date).subscribe((apiresponse: APIData) => {
      console.log(apiresponse);
      this.updateSchedule(apiresponse.data);
    }, (err) => {
      this.scheduleReset()
      this.sharedService.triggerNotifcation("#EA4335", err.msg);
    });
  }

  monthGetWeekRange(monthNumber: number) {
    this.monthFlag = false;
    this.scheduleFlag = true;
    this.weekduration = SharedFunctions.weeks(new Date(new Date().getFullYear(), monthNumber - 1, 1))
    this.getWeeklySlots(this.weekduration[this.selectedWeek].weekStart);
  }

  scheduleToWeek() {
    this.weekFlag = true;
    this.scheduleReset();
    this.monthFlag = true;
    this.selectedWeek = 0;
    this.scheduleFlag = false;
  }

  Reserve(day, slot) {
    console.log("slot : " + this.schedule[day].indexOf(slot));
    this.apiService.userReserveSlot(<ReserveSlotBody>{
      expertID: this.expertUser._id,
      dayNo: JSON.stringify(day),
      slotNo: JSON.stringify(this.schedule[day].indexOf(slot))
    }).subscribe((apiresponse: APIData) => {
      this.updateSchedule(apiresponse.data);
      this.sharedService.triggerNotifcation("#34A853", apiresponse.msg.toString());
    }, (err) => {
      this.sharedService.triggerNotifcation("#EA4335", err.msg);
    });
    console.log(this.schedule[day].indexOf(slot));
    this.popoutUserConfirmation = false;
  }
  //users
  Offer(day, slot) {
    this.apiService.expertOfferSlot(<SlotDateBody>{
      dayNo: JSON.stringify(day),
      slotNo: JSON.stringify(this.schedule[day].indexOf(slot)),
      date: this.weekduration[this.selectedWeek].weekStart,
    }).subscribe((apiresponse: APIData) => {
      this.updateSchedule(apiresponse.data);
      this.sharedService.triggerNotifcation("#34A853", apiresponse.msg.toString());
    }, (err) => {
      this.sharedService.triggerNotifcation("#EA4335", err.msg);
    });
    this.popoutExpertConfirmation = false;
  }
  cancel(){
    this.apiService.expertCancelSlot(<SlotDateBody>{
      dayNo: JSON.stringify(this.dayOffer),
      slotNo: JSON.stringify(this.schedule[this.dayOffer].indexOf(this.slotOffer)),
      date: this.weekduration[this.selectedWeek].weekStart,
    }).subscribe((apiresponse: APIData) => {
      this.popoutExpert = false;
      this.updateSchedule(apiresponse.data);
      this.sharedService.triggerNotifcation("#34A853", apiresponse.msg.toString());
    },(err)=>{
      this.sharedService.triggerNotifcation("#EA4335", err.msg);
    });
  }
}