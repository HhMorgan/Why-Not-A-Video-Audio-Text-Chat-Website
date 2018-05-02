import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { APIService } from '../../@core/service/api.service';
import { APIData , User } from '../../@core/service/models/api.data.structure';
import { LocalDataSource } from 'ng2-smart-table';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';

 @Component({
  selector: 'app-viewUsers',
  templateUrl: './AdminPageUser.component.html',
  styleUrls: ['./AdminPageUser.component.css']
})

export class AdminPageUserComponent implements OnInit {
  public Email;
  public Role;
  public Blocked;
  
   
  ngOnInit() {
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
    actions:{

      custom: [{
        name:'block', 
        title: `<i class="fa fa-lock"></i>` ,
        
      } ,
      {
        name:'upgradeToAdmin', 
        title: `<i class="fa fa-arrow-circle-up"></i>` ,
        
      } ,
       {name:'downgrade', 
       title: `<i class="fa fa-arrows-v"></i>`}]
      
      },
      
    columns: {
      email: {
        title: 'Email',
        type: 'string',
        editable: false,
        addable: false,

      },
      role: {
        title: 'Role',
        type:'string',
        editable: false,
        addable: false,
        default: 'Regular',
      },
      blocked: {
        title: 'Blocked',
        type: 'Boolean',
        editable: false,
        addable: false,
        default: 'False',
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();
  config: ToasterConfig;

  constructor(private _apiService: APIService) {

  }
refresh(): void {
  this._apiService.getUsers().subscribe((apiresponse: APIData)=>{

    for (var i = 0 ; i < apiresponse.data.length ; i++ )

      console.log(apiresponse.data);
    this.source.load(apiresponse.data);
  });
}

public onCustom(event):void{

  if(event.action == 'block'){
    this.OnBlockAndUnblock(event)
  }else if(event.action == 'upgradeToAdmin'){
    this.upgradeToAdmin(event)
  }
  else {
   
    this.OnChangeRole(event);
  }
}


OnBlockAndUnblock(event): void {

  var Users = <User>{};
  Users = event.data;
  if(Users.blocked != true){
    Users.blocked = true;
    this._apiService.BlockAndUnblock(Users).subscribe((apiresponse: APIData)=>{
    // this.showToast( 'default' , 'Message', apiresponse.msg.toString());
      this.refresh();
    });
  }else{
    Users.blocked = false;
    this._apiService.BlockAndUnblock(Users).subscribe((apiresponse: APIData)=>{
    // this.showToast( 'default' , 'Message', apiresponse.msg.toString());
      this.refresh();
    });
  }
}

OnChangeRole(event): void {
  var Users = <User>{};
  Users = event.data;
  if(Users.role == 'expert'){
    Users.role = 'user';
    this._apiService.ChangeRole(Users).subscribe((apiresponse: APIData)=>{
    // this.showToast( 'default' , 'Message', apiresponse.msg.toString());
      this.refresh();
    });
  }else{
    Users.role = 'expert';
    this._apiService.ChangeRole(Users).subscribe((apiresponse: APIData)=>{
    // this.showToast( 'default' , 'Message', apiresponse.msg.toString());
      this.refresh();
    });
    }
}
upgradeToAdmin(event):void{
  var Users = <User>{};
  Users = event.data;

  Users.role = 'admin';
    this._apiService.ChangeRole(Users).subscribe((apiresponse: APIData)=>{
    // this.showToast( 'default' , 'Message', apiresponse.msg.toString());
      this.refresh();
    });
    }

}


// ------------------------------- loading the requests -----------------------------------




