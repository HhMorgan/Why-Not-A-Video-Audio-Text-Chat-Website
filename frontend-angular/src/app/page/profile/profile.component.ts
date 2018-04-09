import { Component, OnInit } from '@angular/core';
import { APIService } from '../../@core/service/api.service';
import { APIData  , User ,FileData } from '../../@core/service/models/api.data.structure'
import {Buffer} from 'buffer';

@Component({
    selector: 'app-profile',
    templateUrl: './template/profile.component.html',
    styleUrls: ['./template/profile.component.scss']
})

export class ProfileComponent implements OnInit {

    constructor(private apiServ:APIService) { };

    ngOnInit() {
        this.getimage();
   
        //this.dragElement(document.getElementById(("name")));
    }

    fileToUpload: File = null;
    editable: boolean = true; // intially just for testing

  handleFileInput(files: FileList) {
    //console.log(files.item(0));
    this.fileToUpload = files.item(0);
    let fy:FileData ={file:files.item(0)};
    this.apiServ.postFile(fy).subscribe(data => {

      // do something, if upload success
      }, error => {
        console.log(error);
      });
      this.getimage();
}
getimage(){
this.apiServ.getimage().subscribe((apires : APIData) =>{

   var bikeImage = document.getElementById("profileimg") as HTMLImageElement
   var reader = new FileReader();
   console.log(apires.data);
   var base64OfPhoto = Buffer.from(apires.data.buffer.data).toString('base64');
   bikeImage.src ="data:image/png;base64,"+ base64OfPhoto;
  });
  
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
