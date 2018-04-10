import { Component, OnInit } from '@angular/core';
import { APIData, User } from '../../../@core/service/models/api.data.structure';
import { APIService } from '../../../@core/service/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './template/signup.component.html',
  styleUrls: ['./template/signup.component.css']
})
export class SignupComponent implements OnInit {
  private email;
  private password;
  private username;
  private passwordConfirmation;
  private signupMessage;

  constructor(private _apiService:APIService) { }

  ngOnInit() {
  }

  signupClick(){
    const user = <User>{};
    user.username=this.username;
    user.email = this.email;
    user.password = this.password;
    if(this.email != null && this.password != null&& this.passwordConfirmation!=null && this.username!=null){
      if(this.password==this.passwordConfirmation){
        this.signupMessage="Begin your journey now";
      }
      else{
        this.signupMessage="Password doesn't match";
      }
  } else
    this.signupMessage = 'Username or Password Can not Be Empty ';
  }

}
