import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


@Component({
  selector: 'app-pop-out',
  templateUrl: './pop-out.component.html',
  //styleUrls: ['./pop-out.component.css']
})
export class PopOutComponent {

  constructor(
    public dialogRef: MatDialogRef<PopOutComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}