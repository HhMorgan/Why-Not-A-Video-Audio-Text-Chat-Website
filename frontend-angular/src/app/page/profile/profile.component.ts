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
    }

    fileToUpload: File = null;

  handleFileInput(files: FileList) {
    //console.log(files.item(0));
    this.fileToUpload = files.item(0);
    let fy:FileData ={file:files.item(0)};
    this.apiServ.postFile(fy).subscribe(data => {
      console.log("LOL");
      // do something, if upload success
      }, error => {
        console.log(error);
      });
      this.getimage();
}
getimage(){
this.apiServ.getimage().subscribe((apires : APIData) =>{
   console.log(apires.data);
   var arrayBuffer = apires.data.buffer.data;
    var bytes = new Uint8Array(arrayBuffer);
   var bikeImage = document.getElementById("profileimg") as HTMLImageElement
   bikeImage.src ="data:image/png;base64,"+ this.encode(bytes);
  });
  
}





   myFunction() {
    document.createElement("INPUT").setAttribute("type", "file");
    document.body.appendChild( document.createElement("INPUT"));
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
