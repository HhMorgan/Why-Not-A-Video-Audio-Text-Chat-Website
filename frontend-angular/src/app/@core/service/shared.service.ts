import { Injectable, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as moment from 'moment';

@Injectable()
export class SharedService {
  isUserLoggedIn: boolean = false;
  @Output() change: EventEmitter<boolean> = new EventEmitter();
  @Output() showNotification: EventEmitter<Object> = new EventEmitter();
  @Output() searchevent: EventEmitter<string> = new EventEmitter();
  @Output() searcheventBy: EventEmitter<string> = new EventEmitter();
  @Output() refreshsearch: EventEmitter<boolean> = new EventEmitter();

  triggerNotifcation(color: string, text: string) {
    this.showNotification.emit({ color, text });
  }

  search(searchtag: string) {
    this.searchevent.emit(searchtag);
  }

  searchBy(searchtype: string) {
    this.searcheventBy.emit(searchtype);
  }

  refreshsearchevent(refreshsearch: boolean) {
    this.refreshsearch.emit(refreshsearch);
  }

  setUserLoggedin(isUserLoggedIn: boolean) {
    this.isUserLoggedIn = isUserLoggedIn;
    this.change.emit(this.isUserLoggedIn);
  }
}

export class SharedFunctions {
  public static loadImageBy(id, imgData, loadbyUrl) {
    var reader: FileReader = new FileReader();
    if (imgData) {
      reader.readAsDataURL(new Blob([new Buffer(imgData.data)], { type: imgData.data.contentType }))
      reader.addEventListener("load", function () {
        var htmlImg = document.getElementById(id) as HTMLImageElement;
        if (htmlImg != null) {
          if (!loadbyUrl) {
            htmlImg.src = reader.result;
          } else {
            htmlImg.style.backgroundImage = 'url(' + reader.result + ')';
          }
        }
      }, false);
    }
  }

  public static getImageUrl(imgData): Promise<String> {
    var reader: FileReader = new FileReader();
    if (imgData) {
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

  public static weekdayWithStartWeekday(date, targetWeekday, startDayOfWeek) {
    var weekday = (moment(date).day() + 7 - startDayOfWeek) % 7;
    return moment(date).add(targetWeekday - weekday, "d", );
  }

  private static sameMonth(a , b) {
    if(a == b ){
      return true;
    } else {
      return false;
    }
  }
  
  private static sameYear(y1 , y2){
    if( y1 == y2 ){
      return true;
    } else {
      return false;
    }
  }
  /*
  Don't Touch you Break it You Fix it
  */
  public static weeks( date ) {
    var lastOfMonth = moment(date).clone().endOf('month'),
      lastOfMonthDate = lastOfMonth.date(),
      firstOfMonth = moment(date).clone(),
      output = [];
    while (true) {
      if(this.sameMonth( this.weekdayWithStartWeekday(firstOfMonth.toDate(), 0, 6).month() , moment(date).clone().month()) ){
        output.push( { weekStart : this.weekdayWithStartWeekday(firstOfMonth.toDate(), 0, 6).format('D-MMMM-YYYY') , 
        WeekEnd : this.weekdayWithStartWeekday(firstOfMonth.toDate(), 6, 6).format('D-MMMM-YYYY') } );
        if( this.sameMonth( this.weekdayWithStartWeekday(firstOfMonth.toDate(), 6, 6).month() , moment(date).clone().month() + 1 ) || 
        !this.sameYear(this.weekdayWithStartWeekday(firstOfMonth.toDate(), 0, 6).year() , moment(date).clone().year() ) ){
          break;
        }
      }
      if(!this.sameYear(this.weekdayWithStartWeekday(firstOfMonth.toDate(), 0, 6).year() , moment(date).clone().year() ) && output.length != 0 ){
        break;
      } else {
        firstOfMonth.add( 7 , 'd' );
      }
    }
    return output;
  }
}