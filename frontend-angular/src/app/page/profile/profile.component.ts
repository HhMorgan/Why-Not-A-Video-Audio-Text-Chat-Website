import { Component, OnInit } from '@angular/core';
import { APIService } from '../../@core/service/api.service';
import { APIData  , User ,FileData } from '../../@core/service/models/api.data.structure'

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
   var arrayBuffer = apires.data.buffer.data;
    var bytes = new Uint8Array(arrayBuffer);
   var bikeImage = document.getElementById("profileimg") as HTMLImageElement
   bikeImage.src ="data:image/png;base64,"+ this.encode(bytes);
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

 encode (input) {
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    while (i < input.length) {
        chr1 = input[i++];
        chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index 
        chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                  keyStr.charAt(enc3) + keyStr.charAt(enc4);
    }
    return output;
}

}
