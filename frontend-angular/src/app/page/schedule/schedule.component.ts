
import { error } from "util";
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from "@angular/router";
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { APIService } from "../../@core/service/api.service";
import { SharedFunctions, SharedService } from "../../@core/service/shared.service";
import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from "@angular/core";
import { APIData, User, Token, ReserveSlotBody, SlotBody, SlotDateBody, ExpertAcceptSlotBody } from '../../@core/service/models/api.data.structure';

@Component({
  selector: 'app-schedule',
  templateUrl: './template/schedule.component.html',
  styleUrls: ['./template/schedule.component.scss']
})
export class ScheduleComponent implements OnInit, OnDestroy {
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
  public sessionid;
  public popout = false;
  public popoutExpert = false;
  public popoutExpertClosed = false;
  public popoutExpertConfirmation = false;
  public popoutUserConfirmation = false;
  public popoutUserCancel = false;

  private expertUser = <User>{};
  private destroyed: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private apiService: APIService, private sharedService: SharedService, private route: ActivatedRoute) {
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
      this.getSchedule(this.expertUser);
    });
  }

  getSchedule(expertUser: User) {
    this.apiService.getSchedule(expertUser).subscribe((apiresponse: APIData) => {
      this.updateSchedule(apiresponse.data);
    }, (err) => {
      this.sharedService.triggerNotifcation.emit({ color: "#EA4335", msg: "Not Offering Slots This Week" });
    })
  }

  mobile() {
    var height = (window.screen.height);
    var width = (window.screen.width);
    if (height <= 850 || width <= 750) {
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
      this.schedule[slot.day][slot.time].session = slot.session;
    }
  }

  ngOnInit() {
    var height = (window.screen.height);
    if (height <= 750) {
      this.scheduleFlag = true;
      this.monthFlag = false;
    }
    Observable.interval(2 * 60 * 1000).takeUntil(this.destroyed).subscribe(() => {
      this.getSchedule(this.expertUser);
    });
    this.scheduleReset();
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
    this.destroyed.complete();
  }

  reserveSameUser(users: any[]) {
    for (let i = 0; i < users.length; i++) {
      var userToken = <Token>this.apiService.getToken(true);
      if (userToken._id === users[i]._id)
        return true;
    }
    return false;
  }

  popoutOn() {
    this.popout = true;
  }

  popoutOff() {
    this.popout = false;
  }
  popoutExpertClosedOn(day: Number, slot: any) {
    if (!this.popoutExpertConfirmation && !this.popoutExpert) {
      this.popoutExpertClosed = true;
      this.dayOffer = day;
      this.slotOffer = slot;
      this.sessionid = slot.session;
    }
  }
  popoutExpertClosedOff() {
    this.sessionid = null;
    this.popoutExpertClosed = false;
  }
  popoutExpertOpenedOrClosed(slot: any) {
    if (slot) {
      if (slot.status == 'Opened') {
        return true;
      }
      return false;
    }
  }
  popoutExpertOn(day: Number, slot: any) {
    if (!this.popoutExpertConfirmation && !this.popoutExpertClosed) {
      this.popoutExpert = true;
      this.dayOffer = day;
      this.slotOffer = slot;
      this.usersRequestedSlot = [];
      this.sessionid = slot.session;
      if (slot.users.length > 0) {
        for (let user of slot.users) {
          this.usersRequestedSlot.push({ id: user._id, username: user.username, day: day, slot: slot });
        }
      }
    }
  }

  popoutExpertOff() {
    this.sessionid = null;
    this.popoutExpert = false;
  }

  popoutExpertConfirmationOn(day, slot) {
    if (!this.popoutExpert && !this.popoutExpertClosed) {
      this.slotOffer = slot;
      this.dayOffer = day;
      this.popoutExpertConfirmation = true;
    }
  }

  popoutExpertConfirmationOff() {
    this.popoutExpertConfirmation = false;
  }

  popoutUserCancelSlotOn(day, slot) {
    if (!this.popoutUserConfirmation) {
      this.slotOffer = slot;
      this.dayOffer = day;
      this.popoutUserCancel = true;
    }
  }

  popoutUserCancelSlotOff() {
    this.popoutUserCancel = false;
  }

  popoutUserConfirmationOn(day, slot) {
    if (!this.popoutUserCancel) {
      this.slotOffer = slot;
      this.dayOffer = day;
      this.popoutUserConfirmation = true;
    }
  }

  popoutUserConfirmationOff() {
    this.popoutUserConfirmation = false;
  }

  AcceptUser(userid: String, day: number, slot: any) {
    this.apiService.expertAcceptSlot(<ExpertAcceptSlotBody>{
      userid: userid,
      dayNo: JSON.stringify(day), slotNo: JSON.stringify(this.schedule[day].indexOf(slot))
    }).subscribe((apiresponse: APIData) => {
      this.updateSchedule(apiresponse.data);
      this.sharedService.triggerNotifcation.emit({ color: "#34A853", msg: apiresponse.msg.toString() });
    }, (err) => {
      this.sharedService.triggerNotifcation.emit({ color: "#EA4335", msg: err.msg });
    });
    this.popoutExpertOff();
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
      this.updateSchedule(apiresponse.data);
      this.sharedService.triggerNotifcation.emit({ color: "#34A853", msg: apiresponse.msg.toString() });
    }, (err) => {
      this.scheduleReset()
      this.sharedService.triggerNotifcation.emit({ color: "#EA4335", msg: err.msg });
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
    this.apiService.userReserveSlot(<ReserveSlotBody>{
      expertID: this.expertUser._id,
      dayNo: JSON.stringify(day),
      slotNo: JSON.stringify(this.schedule[day].indexOf(slot))
    }).subscribe((apiresponse: APIData) => {
      this.updateSchedule(apiresponse.data);
      this.sharedService.triggerNotifcation.emit({ color: "#34A853", msg: apiresponse.msg.toString() });
    }, (err) => {
      this.sharedService.triggerNotifcation.emit({ color: "#EA4335", msg: err.msg });
    });
    this.popoutUserConfirmation = false;
  }

  unReserve() {
    this.apiService.userUnReserveSlot(<ReserveSlotBody>{
      expertID: this.expertUser._id,
      dayNo: JSON.stringify(this.dayOffer),
      slotNo: JSON.stringify(this.schedule[this.dayOffer].indexOf(this.slotOffer))
    }).subscribe((apiresponse: APIData) => {
      this.popoutUserCancel = false;
      this.updateSchedule(apiresponse.data);
      this.sharedService.triggerNotifcation.emit({ color: "#34A853", msg: apiresponse.msg.toString() });
    }, (err) => {
      this.sharedService.triggerNotifcation.emit({ color: "#EA4335", msg: err.msg });
    });
  }
  //users
  Offer(day, slot) {
    this.apiService.expertOfferSlot(<SlotDateBody>{
      dayNo: JSON.stringify(day),
      slotNo: JSON.stringify(this.schedule[day].indexOf(slot)),
      date: this.weekduration[this.selectedWeek].weekStart,
    }).subscribe((apiresponse: APIData) => {
      this.updateSchedule(apiresponse.data);
      this.sharedService.triggerNotifcation.emit({ color: "#34A853", msg: apiresponse.msg.toString() });
    }, (err) => {
      this.sharedService.triggerNotifcation.emit({ color: "#EA4335", msg: err.msg });
    });
    this.popoutExpertConfirmation = false;
  }

  cancel() {
    this.apiService.expertCancelSlot(<SlotDateBody>{
      dayNo: JSON.stringify(this.dayOffer),
      slotNo: JSON.stringify(this.schedule[this.dayOffer].indexOf(this.slotOffer)),
      date: this.weekduration[this.selectedWeek].weekStart,
    }).subscribe((apiresponse: APIData) => {
      this.popoutExpertOff();
      this.updateSchedule(apiresponse.data);
      this.sharedService.triggerNotifcation.emit({ color: "#34A853", msg: apiresponse.msg.toString() });
    }, (err) => {
      this.sharedService.triggerNotifcation.emit({ color: "#EA4335", msg: err.msg });
    });
  }

}