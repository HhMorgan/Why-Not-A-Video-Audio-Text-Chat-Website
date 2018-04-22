import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable()
export class NavBarService {
  isUserLoggedIn :boolean = false;
  @Output() change: EventEmitter<boolean> = new EventEmitter();

  setUserLoggedin( isUserLoggedIn : boolean ) {
    this.isUserLoggedIn = isUserLoggedIn;
    this.change.emit(this.isUserLoggedIn);
  }
}