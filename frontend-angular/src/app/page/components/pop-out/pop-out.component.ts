import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {AdminRatingComponent} from '../admin-rating/admin-rating.component';


@Component({
  selector: 'app-pop-out',
  templateUrl: './pop-out.component.html',
  //styleUrls: ['./pop-out.component.css']
})
export class PopOutComponent {
  /* This class is responsible for pop-ups/dialogs */
  constructor(
    public dialogRef: MatDialogRef<AdminRatingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    /* The constructor above initializes MatDialogRef that holds Components that will use pop-ups
    also it injects data, while passing text to the pop-up you're forced to use data: */

  onNoClick(): void {
    this.dialogRef.close();
  }

  /* The method above is responsible for closing the pop-up after clicking the close button. */
}