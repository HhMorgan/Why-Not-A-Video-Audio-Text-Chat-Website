import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import { APIService } from './api.service';

@Injectable()
export class IOService {
  private url = APIService.apiUrl.substring( 0 , APIService.apiUrl.length - 5 );
  private socket;
  
  sendMessage(message){
    this.socket.emit('message', message);
  }
  
  getMessages() {
    let observable = new Observable(observer => {
      console.log('-----------------------------------')
      console.log(this.url)
      console.log('***********************************')
        this.socket = io.connect(this.url, {
          path : '/api/socket.io',
          query: 'token=' + APIService.getToken(),
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax : 5000,
          reconnectionAttempts: Infinity
        });
        this.socket.on('connect' , () => {
          console.log('fufhueghurhughuogugtobtoubgt')
        })
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