import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { APIService } from '../../@core/service/api.service';
import { APIData, User } from '../../@core/service/models/api.data.structure';
import { LocalDataSource } from 'ng2-smart-table';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})

export class RequestsComponent implements OnInit {
  public Email;
  public Role;
  public Blocked;


  ngOnInit() {
    this.refresh();
  }
  settings = {
    edit: {
      editButtonContent: '',
      saveButtonContent: '',
      cancelButtonContent: '',
    },
    delete: {
      deleteButtonContent: '',
    },
    add: {
      addButtonContent: '',
      createButtonContent: '',
      cancelButtonContent: '',
    },
    pager: {
      display: true,
      perPage: 5
    },
    columns: {
      sender: {
        title: 'Sender',
        type: 'string',
        editable: false,
        addable: false,

      },
      recipient: {
        title: 'Recipient',
        type: 'string',
        editable: false,
        addable: false,
      },

      status: {
        title: 'Status',
        type: 'string',
        editable: false,
        addable: false,
      },
      type: {
        title: 'type',
        type: 'string',
        editable: false,
        addable: false,

      }

    }

  };

  source: LocalDataSource = new LocalDataSource();
  config: ToasterConfig;

  constructor(private _apiService: APIService) {

  }
  refresh(): void {
    this.getRequestFromUsersToBeExpert();
  }


  getRequestFromUsersToBeExpert(): void {
    this._apiService.getRequestsFromUsersToBeExpert().subscribe((apiresponse: APIData) => {

      for (var i = 0; i < apiresponse.data.length; i++)
        this.source.load(apiresponse.data);
    });
  }
}





