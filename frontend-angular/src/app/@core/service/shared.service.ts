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
  private _listners = new Subject<any>();

  listen(): Observable<any> {
     return this._listners.asObservable();
  }

  triggernotifcations(color: string,text:string) {
     this.changenotifications.emit({color,text});
  }

  search(searchtag: string) {
    console.log(searchtag);
    this.searchevent.emit(searchtag);
 }

  setUserLoggedin( isUserLoggedIn : boolean ) {
    this.isUserLoggedIn = isUserLoggedIn;
    this.change.emit(this.isUserLoggedIn);
  }

}