import { Component, OnInit } from '@angular/core';
import {APIService} from '../../@core/service/api.service';
import {APIData , Profile} from '../../@core/service/models/api.data.structure';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-user-profile',
  templateUrl: './template/profile.component.html',
  styleUrls: ['./template/profile.component.css']
})
export class ProfileComponent implements OnInit {
  private email;
  // private password;
  // private confirm_password;
  // private description;

  private profile = <Profile>{};


  constructor(private apiService:APIService ) { }

  ngOnInit() {
  }

  //apirespose-> for each response rage3 men el DB
  //update Email () 3ayza adelha requestbody fiha el new email men el text area/input
  clickEmail(){ //name_of_button_clicked
    this.profile.email = this.email;
    this.apiService.update_Email(this.profile).subscribe((apiresponse: APIData)=>{
      console.log(apiresponse);
      if(apiresponse.msg.includes('Email updated successfully')){
        //refresh and view new email
      }
      else{
        //return message (apiresponse.msg)
      }

    });
}


}
