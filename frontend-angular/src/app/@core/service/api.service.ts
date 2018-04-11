import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient , HttpHeaders  , HttpErrorResponse } from '@angular/common/http';
import { APIData , CandicateSessionData  , Session, SessionData } from './models/api.data.structure';


@Injectable()
export class APIService {
  private apiUrl = 'https://192.168.0.3:3000/api/';
  constructor(private http: HttpClient) {}

  errorHandler(error: HttpErrorResponse) {
    return Observable.throw(error.message || "Server Error");
  }

  addCandidate( sessionData: CandicateSessionData ): Observable<APIData> {
    return this.http.post<APIData>( this.apiUrl + 'session/updateCandidate', sessionData)
    .catch(this.errorHandler);
  }

  updateSessionCandidates( sessionData: CandicateSessionData ): Observable<APIData> {
    return this.http.post<APIData>( this.apiUrl + 'session/updateCandidate', sessionData)
    .catch(this.errorHandler);
  }

  getSessionCandidatesRTCDes(session:SessionData) {
    return this.http.post<APIData>( this.apiUrl + 'session/getCandidatesRTCDes/' + session.sessionId , session)
    .catch(this.errorHandler);
  }
}
