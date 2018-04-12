import { Component, OnInit } from '@angular/core';
import {APIService} from '../../@core/service/api.service';
import {APIData, RequestData} from '../../@core/service/models/api.data.structure';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-request',
  templateUrl: './template/upgradeToExpert.component.html',
  styleUrls: ['./template/upgradeToExpert.component.css'],
 // providers:[APIService]
})
export class upgradeToExpertComponent implements OnInit {

  private requestStatus;
  requests: any;
  constructor(private apiService:APIService ) { }

  ngOnInit() {}



  upgradeToExpertClick(){
 
        this.apiService.upgradeToExpert({ sender: '', recipient: 'admin', type: 'upgradeToExpert', status: '', createdAt: '', viewed: false }).subscribe((apiresponse: APIData)=>{
          console.log(apiresponse.msg);
         this.requestStatus = apiresponse.msg;
        });
      
      } 
    }