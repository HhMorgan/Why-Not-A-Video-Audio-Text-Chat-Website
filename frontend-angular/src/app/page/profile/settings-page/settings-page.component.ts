import { Component, OnInit } from '@angular/core';
import { APIService } from '../../../@core/service/api.service';
import { APIData  , User ,FileData,Profile} from '../../../@core/service/models/api.data.structure'
import { ProfileComponent } from '../../profile/profile.component';


@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.css']
})
export class SettingsPageComponent implements OnInit {

   private email:string;
   private description:string;
   private password:string;
   //private email:string;
   private profile =<Profile>{};


  constructor(private apiServ:APIService) { }
   
  ngOnInit() {
    this.getData();
    this.getpass();
  }

  getpass(){
    this.apiServ.getpassword().subscribe((apires : APIData) =>{
      this.password=apires.data.password;
      console.log(apires.data+"testy");
      //this.getimageuser(apires.data.img);
     // this.loadStatus(apires.data.onlineStatus);            
  })
    }

    updateemail(){
      this.profile.email=((document.getElementById("inputDanger1") as HTMLInputElement).value)
      if( this.profile.email!= ''){

      var x = document.getElementById("warning");
      this.apiServ.update_Email(this.profile).subscribe((apires : APIData) =>{
        x.innerHTML="either the format is wrong or the email is taken";
        console.log(apires.msg);
        if(apires.msg)
           x.innerHTML=""+apires.msg;
       
        x.style.display = "block";
    },(err) =>{
      x.innerHTML=err.msg;x.style.display = "block";
    });
      }
     
      }

     profileinfo(){
      //profileinfo();
    }

     editemail() {
      var x = document.getElementById("email");
          x.style.display = "none";
          var x = document.getElementById("editemail");
          x.style.display = "none";
          var x = document.getElementById("editwithbuttons");
          x.style.display = "block";
          var x = document.getElementById("inputDanger1");
          x.style.display = "block";
          
  }

  CancelUpdateEmail(){
    var x = document.getElementById("warning");
    x.style.display = "block";
    x.style.display = "none";
    
    var x = document.getElementById("email");
    x.style.display = "block";
    var x = document.getElementById("editemail");
    x.style.display = "block";
    var x = document.getElementById("editwithbuttons");
    x.style.display = "none";
    var x = document.getElementById("inputDanger1");
    x.style.display = "none";

  }

  getData(){
  this.apiServ.getUserData().subscribe((apires : APIData) =>{
    this.email = apires.data.email;
    this.description=apires.data.description;
    this.password=apires.data.password;
    console.log(apires.data);
    console.log(this.email);
    //this.getimageuser(apires.data.img);
   // this.loadStatus(apires.data.onlineStatus);            
})
  }
}
