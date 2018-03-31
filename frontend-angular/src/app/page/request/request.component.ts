import { Component, OnInit } from '@angular/core';
import {APIService} from '../../@core/service/api.service';
import {APIData} from '../../@core/service/models/api.data.structure';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-request',
  templateUrl: './template/request.component.html',
  styleUrls: ['./template/request.component.css'],
 // providers:[APIService]
})
export class RequestComponent implements OnInit {

  requests: any;
  constructor(private apiService:APIService ) { }

  ngOnInit() {
    this.apiService.getRequests().subscribe((response: APIData)=>{
      console.log(response);
      this.requests = response.data;
    });
  }
 
  
}
