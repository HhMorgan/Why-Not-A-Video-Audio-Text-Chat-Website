import { Component, OnInit, Input } from '@angular/core';
import { SharedService } from '../../../@core/service/shared.service';
@Component({
  selector: 'app-snackbar',
  templateUrl: './template/snackbar.component.html',
  styleUrls: ['./template/snackbar.component.css']
})
export class SnackbarComponent implements OnInit {
  public snackbarColor;
  public visible: boolean;
  public snackbarMessage  = "";
  

  constructor(private sharedService: SharedService) {}

  ngOnInit() {
    this.sharedService.showNotification.subscribe( ( notification: any ) => {
      this.triggernotifications(notification.color, notification.text);
    })
  }

  triggernotifications(color, text) {
    this.snackbarMessage = text;
    this.snackbarColor = color;
    this.visible = true;    
    setTimeout( () => {
      this.visible = false;
    }, 3000);
  }

}


