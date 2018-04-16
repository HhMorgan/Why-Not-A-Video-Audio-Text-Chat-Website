import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
 import {APIService } from '../../@core/service/api.service';
 import {APIData,Tags } from '../../@core/service/models/api.data.structure';
 import { LocalDataSource } from 'ng2-smart-table';
 import { Ng2SmartTableModule } from 'ng2-smart-table';
 import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-view-users',
  templateUrl: './admin-view-users.component.html',
  styleUrls: ['./admin-view-users.component.css']
})
export class AdminViewUsersComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    
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
    actions: {
    
    },
    
    columns: {
// Initializing the columns with their name and type and whether they are selectable
// when adding or editing the columns or not.        
      email: {
        title: 'Email',
        type: 'string',
        
      },
      username: {
        title: 'Username',
        type:'string',
        editable: false,
        addable: false,
      },
      role: {
        title: 'Role',
        type: 'String',
        editable: false,
        addable: false,
      },
     
        
        
    }
  };
}
