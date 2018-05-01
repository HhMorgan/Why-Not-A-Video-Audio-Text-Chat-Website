import { Component, OnInit } from '@angular/core';
import {APIService} from '../../@core/service/api.service';
import {APIData} from '../../@core/service/models/api.data.structure';

@Component({
  selector: 'app-confirm-mail',
  templateUrl: './confirm-mail.component.html',
  styleUrls: ['./confirm-mail.component.css']
})
export class ConfirmMailComponent implements OnInit {
  response :any ;
  constructor(private apiService:APIService) {
    console.log(window.location.href);
    if(window.location.href.includes('confirm')){
      console.log(window.location.href.split(/[\s/]+/).pop());
    }
    localStorage.setItem('confirmationToken',window.location.href.split(/[\s/]+/).pop());
    this.apiService.confirmEmail().subscribe((apiresponse: APIData)=>{
      this.response = apiresponse.msg;
      console.log(apiresponse);
    });

    
   }

  ngOnInit() {
  }

}
