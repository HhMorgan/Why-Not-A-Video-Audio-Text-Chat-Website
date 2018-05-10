import { Component, OnInit } from '@angular/core';
import { APIData, User } from '../../../@core/service/models/api.data.structure';
import { APIService } from '../../../@core/service/api.service';
import { error } from 'protractor';
import { Routes,Router } from '@angular/router';
import { SharedService } from '../../../@core/service/shared.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './template/forgot.component.html',
  styleUrls: ['./template/forgot.component.css']
})
export class ForgotComponent implements OnInit {
  public email;
  public password;
  public loginMessage;

  constructor(private _apiService:APIService , private router: Router , private sharedService : SharedService ) { }

  ngOnInit() {

  }

  forgotClick(){
    const user = <User>{};
    user.email = this.email;
    user.password = this.password;
    if(this.email != null){
      
  } else
    this.loginMessage = 'Username or Password Can not Be Empty ';
  }
  
  

}
