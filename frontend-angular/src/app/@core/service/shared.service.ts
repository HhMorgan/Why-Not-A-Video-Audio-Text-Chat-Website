import { Injectable, EventEmitter, Output } from '@angular/core';
import { SnackbarCompComponent } from '../../page/components/snackbar-comp/snackbar-comp.component';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
@Injectable()
export class NavBarService {
  isUserLoggedIn :boolean = false;
  @Output() change: EventEmitter<boolean> = new EventEmitter();
  @Output() changenotifications: EventEmitter<Object> = new EventEmitter();
  @Output() searchevent: EventEmitter<string> = new EventEmitter();

  triggernotifcations(color: string,text:string) {
     this.changenotifications.emit({color,text});
  }

  search(searchtag: string) {
    this.searchevent.emit(searchtag);
 }

  setUserLoggedin( isUserLoggedIn : boolean ) {
    this.isUserLoggedIn = isUserLoggedIn;
    this.change.emit(this.isUserLoggedIn);
  }

}