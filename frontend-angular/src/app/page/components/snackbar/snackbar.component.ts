import { Component, OnInit, Input } from '@angular/core';
import { SharedService } from '../../../@core/service/shared.service';
@Component({
  selector: 'app-snackbar',
  templateUrl: './template/snackbar.component.html',
  styleUrls: ['./template/snackbar.component.css']
})
export class SnackbarComponent implements OnInit {
  public snackbarColor;
  public snackbarMessage;
  public visible: boolean;

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
    this.sharedService.triggerNotifcation.subscribe((notification: any) => {
      if (notification.color && notification.msg) {
        this.triggernotifications(notification.color, notification.msg);
      }
    })
  }

  triggernotifications(color, text) {
    this.snackbarMessage = text;
    this.snackbarColor = color;
    this.visible = true;
    setTimeout(() => {
      this.snackbarMessage = null;
      this.snackbarColor = null;
      this.visible = false;
    }, 3000);
  }
}


