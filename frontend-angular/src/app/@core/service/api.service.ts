import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient , HttpHeaders  , HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class APIService {
  private apiUrl = 'http://localhost:3000/api/';
  constructor(private http: HttpClient) {}

  errorHandler(error: HttpErrorResponse) {
    return Observable.throw(error.message || "Server Error");
  }
}
