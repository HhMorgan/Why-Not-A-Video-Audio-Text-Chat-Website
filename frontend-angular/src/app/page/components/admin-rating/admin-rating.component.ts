import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { APIService } from '../../../@core/service/api.service';
import { APIData } from '../../../@core/service/models/api.data.structure';
import { LocalDataSource } from 'ng2-smart-table';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { PopOutComponent } from '../pop-out/pop-out.component';

@Component({
  selector: 'app-admin-rating',
  templateUrl: './admin-rating.component.html',
  styleUrls: ['./admin-rating.component.css']
})
export class AdminRatingComponent implements OnInit {

  settings = {
    actions : false,
    columns: {    
      username: {
        title: 'Username',
        type: 'string',
        editable: false,
      },  
      email: {
        title: 'Email',
        type:'string',
        editable: false,
      },
      rating: {
        title: 'Rating',
        type: 'number',
        editable: false,
      }
    }
  };

  ngOnInit() {
    this.refresh();
  }
  
  source: LocalDataSource = new LocalDataSource(); 
  name: string;

  constructor(private _apiService: APIService, public dialog: MatDialog) {
    this._apiService.getUsers().subscribe((apiresponse: APIData)=>{
      this.source.load( apiresponse.data);
      console.log(apiresponse.data);

    });
}

  refresh(): void {
    // we call the method getUsers through the api.service and then loop on all the 
    // recived data and add it to the ng2smarttable
      this._apiService.getUsers().subscribe((apiresponse: APIData)=>{
        for (var i = 0 ; i < apiresponse.data.length ; i++ )
          console.log(apiresponse.data);
        this.source.load(apiresponse.data);
      });
    }

 // onDeleteConfirm(event): void {
  //  event.confirm.resolve();
//}

// Dialog test (Testing Dialog)

openDialog() { // Method gets called on-click

  /* This part is responsible for popup text to be passed in. */

  const dialogRef = this.dialog.open(PopOutComponent, {
    width: '250px',
    data: {main_header: "hello world", 
    header: "testing",
    body:"Is this thing working?",
    left_button: "Cancel",
    right_button: "Okay"
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log(`Dialog result: ${result}`);
  });

  // Display result (if any).
}

}
