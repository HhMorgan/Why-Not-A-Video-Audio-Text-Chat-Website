import { Component, OnInit } from '@angular/core';
import { APIService } from '../../@core/service/api.service';
import { APIData  , User ,FileData} from '../../@core/service/models/api.data.structure'
import {Buffer} from 'buffer';
import { ActivatedRoute } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';

@Component({
    selector: 'app-profile',
    templateUrl: './template/profile.component.html',
    styleUrls: ['./template/profile.component.scss']
})

export class ProfileComponent implements OnInit {
    private user =<User>{};
    username: string;
    currusername: string;
    description:string;
    private sub: any;
    profileInfo=true;
    profilesettings=false;
  

    constructor(private apiServ:APIService,private route: ActivatedRoute) { };
    changeUserStatus(){
      var onlinestat = document.getElementById("onlinestat");
      var elem = document.querySelector('.toggle-btn');
      //var inputValue = (<HTMLInputElement>document.getElementById("cb-value")).checked;
      if(//inputValue && 
        !this.user.onlineStatus){
       // elem.classList.add('active');
        this.user.onlineStatus=true;
        onlinestat.style.color="#2ecc71";
      }
      else{
        //elem.classList.remove('active');
        this.user.onlineStatus=false;
        onlinestat.style.color="#e74c3c";
      }

      this.apiServ.changeUserStatus(this.user).subscribe((apiresponse:APIData)=>
      {
        console.log(apiresponse);
      })

     // this.loadStatusCurrUser();
    }

    loadStatus(datain)
    {
      var onlinestat = document.getElementById("onlinestat");
      
     // var elem = document.querySelector('.toggle-btn');

      this.apiServ.loadStatus().subscribe((apiresponse:APIData)=>
      {
        if(datain)
      {
        onlinestat.style.color="#2ecc71";
       // elem.classList.add('active');
      }
      else
      {
        onlinestat.style.color="#e74c3c";
        
       // elem.classList.remove('active');
      }
      })

    }

    
    loadStatusCurrUser()
    {
      var onlinestat = document.getElementById("onlinestat");
      
      var elem = document.querySelector('.toggle-btn');

      this.apiServ.loadStatus().subscribe((apiresponse:APIData)=>
      {
        if(apiresponse)
      {
        onlinestat.style.color="#2ecc71";
        elem.classList.add('active');
      }
      else
      {
        onlinestat.style.color="#e74c3c";
        
        elem.classList.remove('active');
      }
      })

    }
   
    ngOnInit() {
       this.route.params.subscribe(params => {
        this.user.username = params['username'];
        this.apiServ.getUserProfile(this.user).subscribe((apires : APIData) =>{
          this.username = apires.data.username;
          this.description=apires.data.description;
          this.getcurrusername();  
          console.log(apires.data);
          console.log(this.username);
          this.getimageuser(apires.data.img);
          this.showrating(apires.data.rating);
          this.loadStatus(apires.data.onlineStatus);            
 })


       
      
        //this.dragElement(document.getElementById(("name")));
     });

       
    }


    showrating(datain){
      var stars = document.querySelectorAll('[id^=star]');
      var textToWrite;
      var i;
      for(i in stars ){
        if (i<datain){
        console.log(i);
          stars[i].classList.add('checked');
        }
         /* do your thing */
      }
     }

    getcurrusername(){
      this.apiServ.getusername().subscribe((apires : APIData) =>{
               this.currusername = apires.data; 
                           
      });      
  }

    isloggeduser(){
     
        if(this.username!=this.currusername){
             return false;
        }
        else{
        return true;       
        }       
    
    }

    public profileinfo(){
      this.profilesettings=false;
      this.profileInfo=true;
    }
    public profilesettingsbtn(){
      this.profilesettings=true;
      this.profileInfo=false;
    
    }

    static staticMethod() {
      console.log('static method has been called.');
    }

   

    fileToUpload: File = null;
    editable: boolean = true; // intially just for testing

  handleFileInput(files: FileList) {
    //console.log(files.item(0));
    this.fileToUpload = files.item(0);
    let fy:FileData ={file:files.item(0)};
    this.apiServ.postFile(fy).subscribe(data => {
      // do something, if upload success
      this.getimage();
      }, error => {
        console.log(error);
      });
      
  }
  
  getimage(){
    this.apiServ.getimage().subscribe((apires : APIData) =>{
      var profileimg = document.getElementById("profileimg") as HTMLImageElement
      var navbarimg = document.getElementById("profileimgnavbar") as HTMLImageElement
      var reader : FileReader = new FileReader();
      reader.readAsDataURL(new Blob( [new Buffer(apires.data.buffer)] , {type: apires.data.contentType}))
      reader.addEventListener("load", function () {
        profileimg.src = reader.result;
        navbarimg.src = reader.result;
      }, false);
      },(err) =>{
      console.log(err);
    });
  }

  getimageuser(datain){
      var profileimg = document.getElementById("profileimg") as HTMLImageElement
     // var navbarimg = document.getElementById("profileimgnavbar") as HTMLImageElement
      var reader : FileReader = new FileReader();
      reader.readAsDataURL(new Blob( [new Buffer(datain.data)] , {type: datain.data.contentType}))
      reader.addEventListener("load", function () {
        profileimg.src = reader.result;
       // navbarimg.src = reader.result;
      }, false);
      
  }

  
  
  myFunction() {
     if (this.editable==true){
       console.log('work');
       var root = document.getElementById("name"); // '0' to assign the first (and only `HTML` tag)
       root.className += ' mydiv';
       this.dragElement(document.getElementById(("name")));
       this.editable=false;
     }
     else{
        var root = document.getElementById("name"); // '0' to assign the first (and only `HTML` tag)
        root.classList.remove('mydiv') ;
        this.editable=true;
     }
      
     // (<HTMLInputElement>document.getElementById(("mydiv"))).disabled =! (<HTMLInputElement>document.getElementById(("mydiv"))).disabled;
      
      // document.stylesheets[0].disabled=!document.styleSheets[0].disabled;
       //document.getElementById("mydiv").disabled = true;
   
}



 dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


}
