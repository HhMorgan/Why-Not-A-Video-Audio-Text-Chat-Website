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
    
}




}
