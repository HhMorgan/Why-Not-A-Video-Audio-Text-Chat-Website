import { Component, OnInit } from '@angular/core';
import { APIData, User } from '../../../@core/service/models/api.data.structure';
import { APIService } from '../../../@core/service/api.service';
import { error } from 'protractor';
import { Routes, Router } from '@angular/router';
import { SharedService } from '../../../@core/service/shared.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './template/forgot.component.html',
  styleUrls: ['./template/forgot.component.css']
})
export class ForgotComponent implements OnInit {
  public email;
  public message;
  public buttonDisabled = false;
  constructor(private _apiService: APIService, private router: Router, private sharedService: SharedService) { }

  ngOnInit() {

  }

  forgotClick() {
    const user = <User>{};
    user.email = this.email;
    this.buttonDisabled = true;
    if (this.email != null) {
      this._apiService.forgetPassword(this.email).subscribe((apiresponse: APIData) => {
        this.message = apiresponse.msg;
        this.buttonDisabled = false;
      }, (error) => {
        this.buttonDisabled = false;
        this.message = error.msg;
      })
    } else {
      this.buttonDisabled = false;
      this.message = 'Email Can not Be Empty ';
    }
  }
}
