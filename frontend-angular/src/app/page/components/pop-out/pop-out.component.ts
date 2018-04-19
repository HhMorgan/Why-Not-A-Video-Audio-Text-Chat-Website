import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {AdminRatingComponent} from '../admin-rating/admin-rating.component';


@Component({
  selector: 'app-pop-out',
  templateUrl: './pop-out.component.html',
  //styleUrls: ['./pop-out.component.css']
})
export class PopOutComponent {
  constructor(
    public dialogRef: MatDialogRef<AdminRatingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}