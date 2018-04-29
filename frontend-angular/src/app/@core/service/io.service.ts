import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import { APIService } from './api.service';

@Injectable()
export class IOService {
  private url = APIService.apiUrl.substring(0,APIService.apiUrl.length - 5);  
  private socket;
  
  sendMessage(message){
    this.socket.emit('message', message);
  }
  
  getMessages() {
    console.log(this.url)
    let observable = new Observable(observer => {
        this.socket = io.connect(this.url, {
          query: 'token=' + APIService.getToken(),
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax : 5000,
          reconnectionAttempts: Infinity
        });
        this.socket.on('message', (data) => {
            observer.next(data);
        });
        return () => {
            this.socket.disconnect();
        };
    })     
    return observable;
  }  
}