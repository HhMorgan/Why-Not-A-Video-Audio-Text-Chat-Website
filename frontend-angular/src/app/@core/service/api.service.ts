import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { APIData , Profile} from '../service/models/api.data.structure';

import { HttpClient , HttpHeaders  , HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class APIService {
  private apiUrl = 'http://localhost:3000/api/';
  constructor(private http: HttpClient) {}

  errorHandler(error: HttpErrorResponse) {
    return Observable.throw(error.message || "Server Error");
  }

  update_Email(profile:Profile):Observable<APIData>{
    console.log(profile)
    return this.http.post<Profile>(this.apiUrl + 'auth/updateEmail',profile)
    .catch(this.errorHandler);
  }

  public static getToken() : string {
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJ1c2VyIiwiY3JlYXRlZEF0IjoiMjAxOC0wNC0wMVQxNjoyMTozNS4zNzhaIiwiX2lkIjoiNWFjMTA3MGYyNTljZjM2ZjYwNTAzYTdlIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiX192IjowfSwiaWF0IjoxNTIyNTk5NzE2LCJleHAiOjE1MjI2NDI5MTZ9.2Q8qnyeAkKN73emJ1KeG97YF93qhDZbu5UQ45bXDg24"
  }

}
