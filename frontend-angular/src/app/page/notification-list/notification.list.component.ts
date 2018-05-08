//The ts document for the notifications page

import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { APIService } from '../../@core/service/api.service';
import { APIData, Tag } from '../../@core/service/models/api.data.structure';
import { LocalDataSource } from 'ng2-smart-table';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';

@Component({
  selector: 'app-notification-list',
  templateUrl: './template/notification.list.component.html',
  styleUrls: ['./template/notification.list.component.scss']
})

export class NotificationListComponent implements OnInit {
  notificationsArray=[];
  ngOnInit() {
    // we call refresh to load data on entery of the page
    this.refresh();
  }
  
  constructor(private _apiService: APIService) {

  }
  //The function that loads all the notifications from the backend
  refresh(): void {
    this._apiService.getNotification().subscribe((apiresponse: APIData)=>{
      for(var i = 0 ; i < apiresponse.data.length ; i++){
        apiresponse.data[i].sender = apiresponse.data[i].sender.username;
        apiresponse.data[i].recipient = apiresponse.data[i].recipient.username;
        console.log(apiresponse.data);
        this.notificationsArray.push({createdAt:apiresponse.data[i].createdAt.split("T",1)[0],message:apiresponse.data[i].message,sender:apiresponse.data[i].sender, recipient:apiresponse.data[i].recipient,type:apiresponse.data[i].type});
      }
      //this.source.load(apiresponse.data);
    });
  }


}

