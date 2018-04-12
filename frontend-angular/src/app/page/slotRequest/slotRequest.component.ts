import { Component, OnInit } from '@angular/core';
import {APIService} from '../../@core/service/api.service';
import {APIData,Request} from '../../@core/service/models/api.data.structure';
import { Observable } from 'rxjs/Observable';
import { LocalDataSource } from 'ng2-smart-table';


@Component({
  selector: 'app-request',
  templateUrl: './template/slotRequest.component.html',
  styleUrls: ['./template/slotRequest.component.css'],
 // providers:[APIService]
})
export class SlotRequestComponent implements OnInit {

  requests: any;
  
  settings = {
    actions: {
      add: false,
      edit:false,
      delete: false,
      custom: [{
        name:'accept', 
        title: "Accept "
      } ,
       {name:'reject', 
       title: " Reject"}],
      },
    columns: {
      sender: {
        title: 'User',
        type: 'string',
      },
      
      createdAt: {
        title: 'CreatedAt',
        type: 'string',
        editable: false,
        addable: false,
      },
     
    },
  };
 
  source: LocalDataSource = new LocalDataSource();
  constructor(private apiService:APIService ) {
    this.apiService.getSlotRequests().subscribe((apiresponse: APIData)=>{
      console.log(apiresponse);
      this.source.load( apiresponse.data);
    });

   }

  ngOnInit() {
   
  }

  custom(event):void{
    if(event.action == 'accept'){
      this.OnAccept(event)
    }else{
      this.OnReject(event)
    }
  }
  OnAccept(event): void {
    var Requests = <Request>{};
    Requests = event.data;
    Requests.status = 'Accepted';
    Requests.viewed = true;
    this.apiService.editSlotRequest(Requests).subscribe((apiresponse: APIData)=>{
      console.log(apiresponse);
      if( apiresponse.msg.includes('successfully') ){ //should route to data-picker page to choose slots
        this.apiService.getSlotRequests().subscribe((apiresponse: APIData)=>{
          this.source.load( apiresponse.data);
        });
      }
    });

  }
  OnReject(event): void {
    var Requests = <Request>{};
    Requests = event.data;
    Requests.status = 'Rejected';
    Requests.viewed = true;
    this.apiService.editSlotRequest(Requests).subscribe((apiresponse: APIData)=>{
      console.log(apiresponse);
      if( apiresponse.msg.includes('successfully') ){
      this.apiService.getSlotRequests().subscribe((apiresponse: APIData)=>{
        this.source.load( apiresponse.data);
      });
    }
    });

  }
  
}
