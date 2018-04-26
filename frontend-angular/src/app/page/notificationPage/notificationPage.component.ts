import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
 import {APIService } from '../../@core/service/api.service';
 import {APIData,Tags } from '../../@core/service/models/api.data.structure';
 import { LocalDataSource } from 'ng2-smart-table';
 import { Ng2SmartTableModule } from 'ng2-smart-table';
 import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';

 @Component({
  selector: 'app-notificationPage',
  templateUrl: './notificationPage.component.html',
  styleUrls: ['./notificationPage.component.scss']
})

export class notificationPageComponent implements OnInit {
  
  ngOnInit() {
   // we call refresh to load data on entery of the page
    this.refresh();
  }
    settings = {
      edit: {
        editButtonContent: '<i  class="fa fa-edit"></i>',
        saveButtonContent: '<i class="fa fa-check"></i>',
        cancelButtonContent: '<i class="fa fa-ban"></i>',
      },
      delete: {
        deleteButtonContent: '<i class="fa fa-trash"></i>',
      },
      add: {
        addButtonContent: '<i class="fa fa-plus"></i>',
        createButtonContent: '<i class="fa fa-check"></i>',
        cancelButtonContent: '<i class="fa fa-close"></i>',
      },
      pager:{
        display: true ,
        perPage: 5
      },

    columns: {
// Initializing the columns with their name and type and whether they are selectable
// when adding or editing the columns or not.        
sender: {                                 
  title: 'Sender',
  type: 'string',
},
status: {                               
  title: 'Status',
  type: 'string',
},
type: {                                
  title: 'Type',
  type: 'string',
},  createdAt: {                          
  title: 'Name',
  default: Date.now,
}     
    }
  };
  //source is the data from the ng2smarttable
  source: LocalDataSource = new LocalDataSource();
  config: ToasterConfig;
  constructor(private _apiService: APIService) {
    //onAdded is called when some 1 adds a tag using the ng2smarttable 
    // this.source.onAdded().subscribe((Tags :Tags)=>{
    //   // we intilialize status to accepted and blocked to false as the admin is 
    //   // the one adding the tag so he doesn't need to write these himself 
    //   Tags.status = 'Accepted';
    //   Tags.blocked = false;
    //   //Then we send APIData to the method named AddTag through the api.service then we 
    //   //refresh after the database has been updated to get the new tag
    //   this._apiService.AddTag(Tags).subscribe((apiresponse: APIData)=>{
    //     console.log(apiresponse.msg);
    //     console.log(Tags);
    //     this.refresh();  
    //   });
    //   this.refresh();  
    // });    
}
refresh(): void {

//   this._apiService.getnotifications().subscribe((apiresponse: APIData)=>{
//     for (var i = 0 ; i < apiresponse.data.length ; i++ )
//       //apiresponse.data[i].id = (i+1);
//       console.log(apiresponse.data);
//     this.source.load(apiresponse.data);
//   });
 }

}

