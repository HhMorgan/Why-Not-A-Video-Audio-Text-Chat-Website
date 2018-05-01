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

  ngOnInit() {
    // we call refresh to load data on entery of the page
    this.refresh();
  }
  settings = {
    actions : {
      add: false,
      edit: false,
      delete: false 
    },
    pager: {
      display: true,
      perPage: 5
    },
    columns: {
      // Initializing the columns with their name and type and whether they are selectable
      // when adding or editing the columns or not.        
      sender: {
        title: 'Sender',
        type: 'string',
      },
      recipient :{
        title : 'recipient',
        type : 'string',
      },
      type: {
        title: 'Type',
        type: 'string',
      }, createdAt: {
        title: 'Name',
        default: Date.now,
      }, message :{
        title: 'Message',
        type: 'string',
      }
    }
  };
  //source is the data from the ng2smarttable
  source: LocalDataSource = new LocalDataSource();
  config: ToasterConfig;
  constructor(private _apiService: APIService) {

  }
  refresh(): void {
    this._apiService.getNotification().subscribe((apiresponse: APIData)=>{
      for(var i = 0 ; i < apiresponse.data.length ; i++){
        apiresponse.data[i].sender = apiresponse.data[i].sender.username;
        apiresponse.data[i].recipient = apiresponse.data[i].recipient.username;
      }
      this.source.load(apiresponse.data);
    });
  }
}

