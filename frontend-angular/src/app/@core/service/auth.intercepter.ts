import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { APIService } from './api.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(this.isIntercepted(req.url))
      req = req.clone({
        setHeaders: { 'authorization': `${APIService.getToken()}`}
        ,});
        return next.handle(req);
  }
  
  public isIntercepted(url:String):boolean {
    for(var i = 0 ; i < APIService.apiUrl_Intercept_Ignore_list.length ; i++)
      if(url.endsWith(APIService.apiUrl_Intercept_Ignore_list[i].toString()))
        return false;
    return true;
  }
}