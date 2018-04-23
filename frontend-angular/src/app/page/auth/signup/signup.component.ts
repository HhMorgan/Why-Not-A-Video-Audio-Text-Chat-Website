import { Component, OnInit } from '@angular/core';
import { APIData, User } from '../../../@core/service/models/api.data.structure';
import { APIService } from '../../../@core/service/api.service';
import { error } from 'protractor';
@Component({
  selector: 'app-login',
  templateUrl: './template/signup.component.html',
  styleUrls: ['./template/signup.component.css']
})
export class SignupComponent implements OnInit {
  public email;
  public username;
  public password;
  public passwordConfirmation;
  public signupMessage;

  constructor(private _apiService:APIService) { }

  ngOnInit() {
  }

  signupClick(){
    const user = <User>{};
    user.email = this.email;
    user.password = this.password;
    user.username=this.username;
    if(this.email != null && this.password != null&& this.passwordConfirmation!=null && this.username!=null){
      if(this.password==this.passwordConfirmation){
        this._apiService.signup(user).subscribe((apiresponse: APIData)=>{
          this.signupMessage = apiresponse.msg;
          if( apiresponse.msg.includes('Welcome') ){
            localStorage.setItem('token', apiresponse.data);
          }
        },(error: APIData)=>{
          this.signupMessage = error.msg;
        })
      }
      else{
        this.signupMessage="Password doesn't match";
      }
  } else
    this.signupMessage = 'Username or Password Can not Be Empty ';
  }

}
