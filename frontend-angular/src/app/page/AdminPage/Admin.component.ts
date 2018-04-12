import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
 import {APIService } from '../../@core/service/api.service';
 import {APIData,Tags } from '../../@core/service/models/api.data.structure';
 import { LocalDataSource } from 'ng2-smart-table';
 import { Ng2SmartTableModule } from 'ng2-smart-table';
 import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';

 @Component({
  selector: 'app-AdminPage',
  templateUrl: './Admin.component.html',
  styleUrls: ['./Admin.component.css']
})

export class AdminComponent implements OnInit {
  
  ngOnInit() {
   // we call refresh to load data on entery of the page
    this.refresh();
  }
  settings = {

    actions:{
// Initializing the custom buttons for the ng2smarttable
      custom: [{
        name:'accept', 
        title: "Accept  "
      } ,
       {name:'reject', 
       title: " Reject  "
      },
      {name:'block',
       title: "Block  " 
      },
      {name: 'unblock',
      title: "Unblock"
      }]
      
      },
    columns: {
// Initializing the columns with their name and type and whether they are selectable
// when adding or editing the columns or not.        
      name: {
        title: 'Name',
        type: 'string',
        
      },
      status: {
        title: 'Status',
        type:'string',
        editable: false,
        addable: false,
      },
      blocked: {
        title: 'Blocked',
        type: 'Boolean',
        editable: false,
        addable: false,
      }
    }
  };
//source is the data from the ng2smarttable
  source: LocalDataSource = new LocalDataSource();
  config: ToasterConfig;
// this is a constructor for all the APIServices in the pages
  constructor(private _apiService: APIService) {
    //onAdded is called when some 1 adds a tag using the ng2smarttable 
    this.source.onAdded().subscribe((Tags :Tags)=>{
      // we intilialize status to accepted and blocked to false as the admin is 
      // the one adding the tag so he doesn't need to write these himself 
        Tags.status = 'Accepted';
        Tags.blocked = false;
//Then we send APIData to the method named AddTag through the api.service then we 
//refresh after the database has been updated to get the new tag
      this._apiService.AddTag(Tags).subscribe((apiresponse: APIData)=>{
        console.log(apiresponse.msg);
        console.log(Tags);
        this.refresh();  
      });
      this.refresh();  
    });

//This is called when the user removes a tag using ng2smarttable
    this.source.onRemoved().subscribe((Tags :Tags)=>{
//Then we send APIData to the method named deleteTags through the api.service then we 
//refresh after the database has been updated to get the tags without the delete tag
      this._apiService.deleteTags(Tags).subscribe((apiresponse: APIData)=>{
 //       console.log(apiresponse);
        this.refresh();
      });
    });

     
//This is called when the user edits a tag using ng2smarttable      
      this.source.onUpdated().subscribe((Tags :Tags)=>{
//Then we send APIData to the method named editTag through the api.service then we 
//refresh after the database has been updated to get the tags without the updated tag
        this._apiService.editTag(Tags).subscribe((apiresponse: APIData)=>{
         // this.showToast( 'default' , 'Message', apiresponse.msg.toString());
          this.refresh();
        });
      });

      
}
// the refresh method loads all the data from the database and inserts it into the 
// ng2smarttable
refresh(): void {
// we call the method getTags through the api.service and then loop on all the 
// recived data and add it to the ng2smarttable
  this._apiService.getTags().subscribe((apiresponse: APIData)=>{
    for (var i = 0 ; i < apiresponse.data.length ; i++ )
      //apiresponse.data[i].id = (i+1);
      console.log(apiresponse.data);
    this.source.load(apiresponse.data);
  });
}
// this initializes custom events for the buttons that we added in the ng2smarttable 
custom(event):void{
  if(event.action == 'accept'){
    this.OnAccept(event)
  }
  if(event.action == 'block'){
    this.OnBlock(event)
  }
  if(event.action == 'unblock'){
    this.OnUnblock(event)
  }
  if(event.action == 'reject'){
    this.OnReject(event)
  }
}
//this method is invoked when the user presses the custom made button Block
OnBlock(event): void {
  var Tags = <Tags>{};
  Tags = event.data;
// we check if the tag is not accepted if it is not we change it's status through edit tags
//to accepted otherwise we say the tag is already accepted and we don't change the data   
  if(Tags.blocked != true){
    Tags.blocked = true;
    this._apiService.editTag(Tags).subscribe((apiresponse: APIData)=>{
    // this.showToast( 'default' , 'Message', apiresponse.msg.toString());
      this.refresh();
    });
  }else{
    console.log("This Tag is Already Blocked")
  }
}
OnUnblock(event): void {
  var Tags = <Tags>{};
  Tags = event.data;
// we check if the tag is not accepted if it is not we change it's status through edit tags
//to accepted otherwise we say the tag is already accepted and we don't change the data   
  if(Tags.blocked != false){
    Tags.blocked = false;
    this._apiService.editTag(Tags).subscribe((apiresponse: APIData)=>{
    // this.showToast( 'default' , 'Message', apiresponse.msg.toString());
      this.refresh();
    });
  }else{
    console.log("This Tag is Already UnBlocked")
  }
}

//this method is invoked when the user presses the custom made button Accept
OnAccept(event): void {
  var Tags = <Tags>{};
  Tags = event.data;
// we check if the tag is not accepted if it is not we change it's status through edit tags
//to accepted otherwise we say the tag is already accepted and we don't change the data   
  if(Tags.status != 'Accepted'){
    Tags.status = 'Accepted';
    this._apiService.editTag(Tags).subscribe((apiresponse: APIData)=>{
    // this.showToast( 'default' , 'Message', apiresponse.msg.toString());
      this.refresh();
    });
  }else{
    console.log("This Tag is Already Accepted")
  }
}
//this method is invoked when the user presses the custom made button Reject
OnReject(event): void {
  var Tags = <Tags>{};
  Tags = event.data;
// we check if the tag is not accepted if it is not we change it's status through edit tags
//to rejected otherwise we say the tag is already Rejected and we don't change the data   
  if(Tags.status != 'Rejected'){
    Tags.status = 'Rejected';
    this._apiService.editTag(Tags).subscribe((apiresponse: APIData)=>{
    // this.showToast( 'default' , 'Message', apiresponse.msg.toString());
      this.refresh();
    });
  }else{
    console.log("This Tag is Already Rejected")
  }
}
//onDeleteConfirm(event): void {
  //  event.confirm.resolve();
//}

}

