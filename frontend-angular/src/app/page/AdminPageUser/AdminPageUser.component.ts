import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { APIService } from '../../@core/service/api.service';
import { APIData, User } from '../../@core/service/models/api.data.structure';
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
    delete: {
      deleteButtonContent: '<i class="fa fa-trash"></i>',
    },
    add: {
      addButtonContent: '<i class="fa fa-plus"></i>',
      createButtonContent: '<i class="fa fa-check"></i>',
      cancelButtonContent: '<i class="fa fa-close"></i>',
    },
    edit: {
      editButtonContent: '<i  class="fa fa-edit"></i>',
      saveButtonContent: '<i class="fa fa-check"></i>',
      cancelButtonContent: '<i class="fa fa-ban"></i>',
    },
    pager: {
      display: true,
      perPage: 5
    },
    actions: {
      edit: true,
      add: false,
      custom: [
        {
          name: 'block',
          title: `<i class="fa fa-lock"></i>`,
        },
        {
          name: 'upgradeToAdmin',
          title: `<i class="fa fa-arrow-circle-up"></i>`,
        }, {
          name: 'downgrade',
          title: `<i class="fa fa-arrows-v"></i>`
        }, {
          name: 'Verify',
          title: `<i class="fa fa-check"></i>`
        }
      ]
    },

    columns: {
      username: {
        title: 'Username',
        type: 'string',
        editable: true,
        addable: false,
      },
      email: {
        title: 'Email',
        type: 'string',
        editable: false,
        addable: false,
      },
      role: {
        title: 'Role',
        type: 'string',
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
      },
      isVerified: {
        title: 'Verified',
        type: 'Boolean',
        editable: false,
        addable: false,
        default: 'false',
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();
  config: ToasterConfig;

  constructor(private _apiService: APIService) {
    this.source.onUpdated().subscribe((event) => {
      this.adminChangeAccountUsername(event);
    })
  }
  refresh(): void {
    this._apiService.getUsers().subscribe((apiresponse: APIData) => {
      this.source.load(apiresponse.data);
    });
  }

  public onCustom(event): void {

    switch (event.action) {
      case "block":
        this.OnBlockAndUnblock(event);
        break;

      case "downgrade":
        this.OnChangeRole(event);
        break;

      case "upgradeToAdmin":
        this.upgradeToAdmin(event);
        break;

      case "Verify":
        this.verifyAccount(event);
        break;
    }
  }


  OnBlockAndUnblock(event): void {

    var Users = <User>{};
    Users = event.data;
    if (Users.blocked != true) {
      Users.blocked = true;
      this._apiService.BlockAndUnblock(Users).subscribe((apiresponse: APIData) => {
        // this.showToast( 'default' , 'Message', apiresponse.msg.toString());
        this.refresh();
      }, (err) => {
        this.refresh();
      });
    } else {
      Users.blocked = false;
      this._apiService.BlockAndUnblock(Users).subscribe((apiresponse: APIData) => {
        // this.showToast( 'default' , 'Message', apiresponse.msg.toString());
        this.refresh();
      }, (err) => {
        this.refresh();
      });
    }
  }

  OnChangeRole(event): void {
    var Users = <User>{};
    Users = event.data;
    if (Users.role == 'expert') {
      Users.role = 'user';
      this._apiService.ChangeRole(Users).subscribe((apiresponse: APIData) => {
        // this.showToast( 'default' , 'Message', apiresponse.msg.toString());
        this.refresh();
      }, (err) => {
        this.refresh();
      });
    } else {
      Users.role = 'expert';
      this._apiService.ChangeRole(Users).subscribe((apiresponse: APIData) => {
        // this.showToast( 'default' , 'Message', apiresponse.msg.toString());
        this.refresh();
      }, (err) => {
        this.refresh();
      });
    }
  }

  upgradeToAdmin(event): void {
    var Users = <User>{};
    Users = event.data;

    Users.role = 'admin';
    this._apiService.ChangeRole(Users).subscribe((apiresponse: APIData) => {
      this.refresh();
    }, (err) => {
      this.refresh();
    });
  }

  verifyAccount(event): void {
    this._apiService.adminVerifyAccount(<User>(event.data)).subscribe((apiresponse: APIData) => {
      this.refresh();
    }, (err) => {
      this.refresh();
    });
  }

  adminChangeAccountUsername(event): void {
    this._apiService.adminChangeUsername(<User>{ _id: event._id, username: event.username }).subscribe((apiresponse: APIData) => {
      this.refresh();
    }, (err) => {
      this.refresh();
    });
  }
}


// ------------------------------- loading the requests -----------------------------------




