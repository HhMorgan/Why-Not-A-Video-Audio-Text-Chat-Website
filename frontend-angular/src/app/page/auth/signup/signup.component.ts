import { Component, OnInit } from '@angular/core';
import { APIData, User } from '../../../@core/service/models/api.data.structure';
import { APIService } from '../../../@core/service/api.service';
import { error } from 'protractor';
import { Router } from '@angular/router';
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
  public buttonDisabled = false;

  constructor(private _apiService : APIService , private router: Router) { }

  ngOnInit() {
  }

  signupClick(){
    const user = <User>{};
    user.email = this.email;
    this.buttonDisabled = true;
    user.username=this.username;
    user.password = this.password;
    if(this.email != null && this.password != null&& this.passwordConfirmation!=null && this.username!=null){
      if(this.password==this.passwordConfirmation){
        this._apiService.signup(user).subscribe((apiresponse: APIData)=>{
          this.signupMessage = apiresponse.msg;
          this.router.navigate(['page/login']); 
          this.buttonDisabled = false;
        },(error: APIData)=>{
          this.signupMessage = error.msg;
          this.buttonDisabled = false;
        })
      }
      else{
        this.signupMessage="Password doesn't match";
      }
  } else
    this.signupMessage = 'Username or Password Can not Be Empty ';
  }

}
