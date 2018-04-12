import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';

import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders  , HttpErrorResponse } from '@angular/common/http';
import { APIData , SlotData , Session , CandicateSession , Profile , User , FileData } from '../service/models/api.data.structure';

@Injectable()
export class APIService {
  private apiUrl = 'http://localhost:3000/api/';
  public static apiUrl_Intercept_Ignore_list: Array<String> = ['auth/login','auth/signup'];
  constructor(private http: HttpClient) {}

  public static getToken() : string {
    return localStorage.getItem('token');
  }

  errorHandler(apiResponse: HttpErrorResponse) {
    return Observable.throw(apiResponse.error);
  }

  login(user:User):Observable<APIData>{
    return this.http.post<APIData>(this.apiUrl + 'auth/login', user).catch(this.errorHandler);
  }
  signup(user:User):Observable<APIData>{
    return this.http.post<APIData>(this.apiUrl + 'auth/signup', user).catch(this.errorHandler);
  }

  update_Email(profile:Profile):Observable<APIData>{
    console.log(profile.email)
    return this.http.post<APIData>(this.apiUrl + 'auth/updateEmail', profile).catch(this.errorHandler);
  }

  postFile(fileData: FileData): Observable<APIData> {
    const formData: FormData = new FormData();
    formData.append('file', fileData.file, fileData.file.name);
    return this.http.post<APIData>(this.apiUrl + 'photo', formData).catch(this.errorHandler);
  }

  getimage(): Observable<APIData> {
    return this.http.get<APIData>(this.apiUrl + 'getphoto').catch(this.errorHandler);
  }

  chooseSlot(slotData:SlotData): Observable<APIData>{
    console.log(slotData);
   return this.http.post<APIData>(this.apiUrl + 'expert/chooseSlot' , slotData).catch(this.errorHandler);
 
  }

  addCandidate( sessionData : CandicateSession ): Observable<APIData> {
    return this.http.post<APIData>( this.apiUrl + 'session/updateCandidate', sessionData)
    .catch(this.errorHandler);
  }

  updateSessionCandidates( sessionData : CandicateSession ): Observable<APIData> {
    return this.http.post<APIData>( this.apiUrl + 'session/updateCandidate', sessionData)
    .catch(this.errorHandler);
  }

  getSessionCandidatesRTCDes( session : Session ) {
    return this.http.post<APIData>( this.apiUrl + 'session/getCandidatesRTCDes/' + session.sessionId , session)
    .catch(this.errorHandler);
  }
}
