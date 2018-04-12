import { Component, OnInit } from '@angular/core';
import {APIService} from '../../@core/service/api.service';
import {APIData} from '../../@core/service/models/api.data.structure';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-request',
  templateUrl: './template/viewSchedule.component.html',
  styleUrls: ['./template/viewSchedule.component.css'],
 // providers:[APIService]
})
export class viewScheduleComponent implements OnInit {


  requests: any;
  constructor(private apiService:APIService ) { }

  ngOnInit() {
    this.apiService.viewSchedule().subscribe((response: APIData)=>{
      console.log(response);
      this.requests = response.data;
    });
  }

  
}