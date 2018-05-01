import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { APIService } from '../../@core/service/api.service';
import { APIData, Tag } from '../../@core/service/models/api.data.structure';
import { LocalDataSource } from 'ng2-smart-table';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
@Component({
    selector: 'app-login',
    templateUrl: './schedule2.component.html',
    styleUrls: ['./schedule2.component.scss']
  })
export class Schedule2Component implements OnInit {

    ngOnInit() {
        // we call refresh to load data on entery of the page
      }
    }
