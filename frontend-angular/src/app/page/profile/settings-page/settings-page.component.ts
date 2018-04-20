import { Component, OnInit,Input } from '@angular/core';
import { APIService } from '../../../@core/service/api.service';
import { APIData  , User ,FileData,Profile} from '../../../@core/service/models/api.data.structure'
import { ProfileComponent } from '../../profile/profile.component';


@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.css']
})
export class SettingsPageComponent implements OnInit {

  @Input() profilComp: ProfileComponent;

   private email:string;
   private description:string;
   private password:string;
   private profile =<Profile>{};
   private username:string;


  constructor(private apiServ:APIService) { }
   
  ngOnInit() {
    this.getData();
  }


    updateemail(){
      var element = document.getElementById("inputemail");
      var groupofdanger = document.getElementById("groupdanger");
      this.profile.email=((document.getElementById("inputemail") as HTMLInputElement).value)
      if( this.profile.email!= ''){

      var x = document.getElementById("warning");
      this.apiServ.update_Email(this.profile).subscribe((apires : APIData) =>{
        x.innerHTML="either the format is wrong or the email is taken";
        console.log(apires.msg);
        if(apires.msg){
           x.innerHTML=""+apires.msg; 
           groupofdanger.classList.remove("has-danger");
           groupofdanger.classList.add("has-success");
           element.classList.add("form-control-success");
           this.getData();
        }
       
        x.style.display = "block";
    },(err) =>{
      element.classList.remove("form-control-success");
      element.classList.add("form-control-danger");
      groupofdanger.classList.add("has-danger");
      groupofdanger.classList.remove("has-success");
        x.innerHTML=err.msg;
        x.style.display = "block";
    });
      }
     
      }


      UpdatePassword(){
        var element = document.getElementById("textdesc");
        var success = document.getElementById("succ");
        var EditingMsg = document.getElementById("warningPassword");
        var EditPasswordDiv= document.getElementById("EditPasswordDiv")
        this.profile.oldPassword=((document.getElementById("oldpass") as HTMLInputElement).value)
        this.profile.password=((document.getElementById("newpass") as HTMLInputElement).value)
        this.profile.confirmPassword=((document.getElementById("confirmpass") as HTMLInputElement).value)
        if( true){
          console.log( this.profile.oldPassword);
        this.apiServ.update_Password(this.profile).subscribe((apires : APIData) =>{
          console.log(apires);
          if(apires.msg){
             this.getData();
             EditPasswordDiv.classList.remove("has-danger");
             EditPasswordDiv.classList.add("has-success");
             EditingMsg.innerHTML=""+apires.msg;
            
          }
          EditingMsg.style.display="block";
         
      },(err) =>{
        EditPasswordDiv.classList.remove("has-success");
        EditPasswordDiv.classList.add("has-danger");
          EditingMsg.innerHTML=""+err.msg;EditingMsg.style.display="block";
          //document.getElementById("confirmpass").classList.add("form-control-danger");
      });
        }
       

      }


      UpdateDesc(){
        var element = document.getElementById("textdesc");
        var success = document.getElementById("succ");
        this.profile.description=((document.getElementById("textdesc") as HTMLInputElement).value)
        if( this.profile.description!= ''){
        
        this.apiServ.update_Desc(this.profile).subscribe((apires : APIData) =>{
          console.log(apires.msg);
          if(apires.msg){
             this.getData();
             success.innerHTML=""+apires.msg;
            
          }
          success.style.display="block";
         
      },(err) =>{
      
      });
        }
       

      }

     profileinfo(){
      var x = document.getElementById("settings-page");
      var y = document.getElementById("profile-page");
      x.style.display = "none";
      y.style.display = "block";
    }

    


     editemail() {
          var x = document.getElementById("editemail");
          x.style.display = "none";
          var x = document.getElementById("editwithbuttons");
          x.style.display = "block";
          var x = document.getElementById("inputemail");
          x.style.display = "block";
          
  }

  editPasswordView(){
    var x = document.getElementById("editPassword");
    x.style.display = "none";
    var x = document.getElementById("EditPasswordDiv");
    x.style.display = "block";
  }

  CancelEditPasswordView(){
    var x = document.getElementById("editPassword");
    x.style.display = "block";
    var x = document.getElementById("EditPasswordDiv");
    x.style.display = "none";
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
    var x = document.getElementById("inputemail");
    x.style.display = "none";

  }

  editdesc() {
    var x = document.getElementById("editdesc");
    x.style.display = "none";
    var x = document.getElementById("textdesc");
    x.style.display = "block";
    var x = document.getElementById("editwithbuttonsdesc");
    x.style.display = "block";
    
}

CancelUpdateDesc(){
  var x = document.getElementById("editdesc");
  x.style.display = "block";
  var x = document.getElementById("textdesc");
  x.style.display = "none";
  var x = document.getElementById("editwithbuttonsdesc");
  x.style.display = "none";
  var x = document.getElementById("succ");
  x.style.display = "none";
}

  getData(){
  this.apiServ.getUserData().subscribe((apires : APIData) =>{
    this.email = apires.data.email;
    this.description=apires.data.description;
    this.password=apires.data.password;
    this.username=apires.data.username;
})
  }
}
