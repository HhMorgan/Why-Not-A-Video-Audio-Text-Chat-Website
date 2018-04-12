import { Component, OnInit } from '@angular/core';
import {APIService} from '../../@core/service/api.service';
import {APIData, RequestData} from '../../@core/service/models/api.data.structure';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-request',
  templateUrl: './template/userProfile.component.html',
  styleUrls: ['./template/userProfile.component.css'],
 // providers:[APIService]
})
export class userProfileComponent implements OnInit {

  private requestStatus;
  requests: any;
  constructor(private apiService:APIService ) { }

  ngOnInit() {
    this.apiService.viewSchedule().subscribe((response: APIData)=>{
      console.log(response);
      this.requests = response.data;
    });}


   /*this.apiService.upgradeToExpert(requestdata: RequestData).subscribe((response: APIData)=>{
      console.log(response);
      this.requests = response.msg;
    });*/
  


 


  upgradeToExpertClick(){
 
        this.apiService.upgradeToExpert({ sender: '', recipient: 'admin', type: 'upgradeToExpert', status: '', createdAt: '', viewed: false }).subscribe((apiresponse: APIData)=>{
          console.log(apiresponse.msg);
         this.requestStatus = apiresponse.msg;
        });
      
      } 
    }