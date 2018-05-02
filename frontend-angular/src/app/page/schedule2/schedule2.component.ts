import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { APIService } from '../../@core/service/api.service';
import { APIData, Tag } from '../../@core/service/models/api.data.structure';
import { LocalDataSource } from 'ng2-smart-table';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
@Component({
    selector: 'app-schedule2',
    templateUrl: './schedule2.component.html',
    styleUrls: ['./schedule2.component.scss']
  })
export class Schedule2Component implements OnInit {
  public slots :any[] = []; 
 
  constructor( private apiservice : APIService ){
    apiservice.getScheduleV2().subscribe((apiresponse: APIData) => {
      console.log(apiresponse.data);
    });

    apiservice.getViewRequestedSlotsSchdeuleV2().subscribe((apiresponse: APIData) => {
      this.slots.push({accepted:apiresponse.data.usersAccepted,requested:apiresponse.data.usersRequested});
    });

  }

  reserve( email  , sessionid ){
    this.apiservice.userReserveScheduleV2(email,sessionid).subscribe((apiresponse : APIData) =>{
      console.log(apiresponse.data);
    });
  }

  accept( username , date ){
    this.apiservice.expertAcceptRequestScheduleV2(username,date).subscribe((apiresponse : APIData) =>{
      console.log(apiresponse.data);
    })
  }

  declineslot( username , date ){
    this.apiservice.expertRejectRequestScheduleV2( username , date ).subscribe((apiresponse : APIData) =>{
      console.log(apiresponse);
    });
  }

  rejectAllSlot( date ) {
    this.apiservice.expertRejectAllRequestScheduleV2(date).subscribe((apiresponse : APIData) => {
      console.log(apiresponse.data);
    }
  )}
  createScheduleV2(date){
    console.log(date)
    this.apiservice.createScheduleV2(date).subscribe((apiresponse : APIData)=>{
      console.log(apiresponse.data);
    });
  }
  ngOnInit() {
  }
}
