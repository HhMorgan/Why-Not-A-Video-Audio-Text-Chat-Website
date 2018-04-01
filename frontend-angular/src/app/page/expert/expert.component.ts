import { Component, OnInit } from '@angular/core';
import {APIService} from '../../@core/service/api.service';
import {APIData} from '../../@core/service/models/api.data.structure';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-request',
  templateUrl: './template/expert.component.html',
  styleUrls: ['./template/expert.component.css'],
 // providers:[APIService]
})
export class ExpertComponent implements OnInit {
  speciality:'';

  email:'';
  requests: any;
  constructor(private apiService:APIService ) { }

  ngOnInit() {
    // this.apiService.getRequests().subscribe((response: APIData)=>{
    //   console.log(response);
    //   this.requests = response.data;
    // });
  }
 toRequests(){
  //redirected to requests page
 }
  addSpeciality($event){
  //this.apiService.addSpeciality().subscribe((apiresponse: APIData)=>{
   if(this.speciality!=null){ //email to be removed and token added
    this.apiService.addSpeciality({email:this.email},{speciality:this.speciality}).subscribe((apiresponse: APIData)=>{
      console.log(apiresponse);
  });
  }
}
}
