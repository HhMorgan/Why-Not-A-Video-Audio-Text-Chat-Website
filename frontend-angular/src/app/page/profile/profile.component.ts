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

    ngOnInit() {}

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
}



   myFunction() {
    document.createElement("INPUT").setAttribute("type", "file");
    document.body.appendChild( document.createElement("INPUT"));
}
}
