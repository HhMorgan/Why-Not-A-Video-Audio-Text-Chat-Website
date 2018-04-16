import { Component, OnInit } from '@angular/core';
import {APIService} from '../../@core/service/api.service';
import {APIData, OfferedSlots} from '../../@core/service/models/api.data.structure';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-searchTagExpert',
  templateUrl: './template/tagSearch.component.html',
  styleUrls: ['./template/tagSearch.component.css'],
 // providers:[APIService]
})
export class TagSearchComponent implements OnInit {

  private slot; //Omar
  private expert;
  requests: any; //Omar
  constructor(private apiServ:APIService ) { }

  ngOnInit() {this.apiServ.getOfferedSlots().subscribe((response: APIData)=>{ //Omar
    console.log(response);                                         //Omar
    this.requests = response.data;                                 //Omar
  });}

  

  chooseSlot(){ 
            
    const offered = <OfferedSlots>{};
    
    offered.expert_email = this.expert;
    offered.status = this.slot;
    
    if(this.expert != null && this.slot!=null ){
    
    this.apiServ.reserve(offered).subscribe((apiresponse: APIData)=>{
    
    //this.tagMessage = apiresponse.msg;
    
    console.log(apiresponse.msg);
    
    },(error: APIData)=>{
    
    
    console.log(error.msg);
    
    })
    
    } else
    console.log('hii');;
    console.log();
   } 
    }
