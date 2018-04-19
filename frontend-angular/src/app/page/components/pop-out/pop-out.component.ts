import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


@Component({
  selector: 'app-pop-out',
  templateUrl: './pop-out.component.html',
  //styleUrls: ['./pop-out.component.css']
})
export class PopOutComponent {

  header: string;
  body: string;

  public setHeader(header:string) {
    this.header = header;
  }

  public getHeader() {
    return this.header;
  }

  public getBody() {
    return this.body;
  }

  public setBody(body:string) {
    this.body = body;
  }

  

}