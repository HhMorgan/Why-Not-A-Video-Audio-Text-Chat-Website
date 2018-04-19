import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import { APIService } from './api.service';

@Injectable()
export class SessionService {
  private url = 'https://192.168.1.199:3000';  
  private socket;
  
  sendMessage(message){
    this.socket.emit('message', message);
  }
  
  getMessages() {
    let observable = new Observable(observer => {
        this.socket = io.connect(this.url, {
          query: 'token=' + APIService.getToken()
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