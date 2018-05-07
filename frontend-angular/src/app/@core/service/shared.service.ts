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
  @Output() searcheventBy: EventEmitter<string> = new EventEmitter();
  @Output() refreshsearch: EventEmitter<boolean> = new EventEmitter();

  triggernotifcations(color: string,text:string) {
     this.changenotifications.emit({color,text});
  }
  
  search(searchtag: string) {
    this.searchevent.emit(searchtag);
  }
  
  searchBy(searchtype: string) {
    this.searcheventBy.emit(searchtype);
  }
  
  refreshsearchevent( refreshsearch:boolean ) {
    this.refreshsearch.emit(refreshsearch);
  }

  setUserLoggedin( isUserLoggedIn : boolean ) {
    this.isUserLoggedIn = isUserLoggedIn;
    this.change.emit(this.isUserLoggedIn);
  }
}

export class SharedFunctions {
  public static loadImageBy(id , imgData , loadbyUrl ){
    var reader: FileReader = new FileReader();
    if(imgData){
      reader.readAsDataURL(new Blob([new Buffer(imgData.data)], { type: imgData.data.contentType }))
      reader.addEventListener("load", function () {
        var htmlImg = document.getElementById(id) as HTMLImageElement;
        if (htmlImg != null) {
          if(!loadbyUrl){
            htmlImg.src = reader.result;
          } else {
            htmlImg.style.backgroundImage = 'url(' + reader.result + ')';
          }
        }
      }, false);
    }
  }

  public static getImageUrl(imgData) : Promise<String> {
    var reader: FileReader = new FileReader();
    if(imgData){
      return new Promise<String>(resolve => {
        reader.readAsDataURL(new Blob([new Buffer(imgData.data)], { type: imgData.data.contentType }))
        reader.addEventListener("load", () => {
          resolve(reader.result);
        }, false);
      })
    } else {
      return new Promise<String>(resolve => {
        resolve("../assets/img/default-Profile-Pic.png");
      });
    }
  }
}