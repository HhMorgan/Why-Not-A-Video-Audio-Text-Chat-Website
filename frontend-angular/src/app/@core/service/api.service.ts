import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';

import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders  , HttpErrorResponse } from '@angular/common/http';
import { APIData , SlotData,Tags , Session ,Request, CandicateSession , Profile , User , FileData,RequestData,OfferedSlots } from '../service/models/api.data.structure';

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

 // all the methods here are used to link between the frontend and the backend by
 // using the url of the local host + url of the method that is created in the index
  getTags(): Observable<APIData> {
     return this.http.get<APIData>(this.apiUrl + 'Tags/getTags').catch(this.errorHandler);
  }

  
  signup(user:User):Observable<APIData> {
    return this.http.post<APIData>(this.apiUrl + 'auth/signup', user).catch(this.errorHandler);
  }

  
  AddTag(Tags:Tags): Observable<APIData> {
    return this.http.post<APIData>(this.apiUrl + 'Tags/AddTag', Tags).catch(this.errorHandler);
  }

  editTag(Tags:Tags):Observable<APIData> {
    return this.http.patch<APIData>(this.apiUrl + '/Tag/editTags/'+Tags._id,Tags)
    .catch(this.errorHandler);
  }

  deleteTags(Tags:Tags):Observable<APIData> {
    return this.http.delete<APIData>(this.apiUrl + '/Tags/deleteTags/'+Tags._id)
    .catch(this.errorHandler);
  }

  getSlotRequests(): Observable<APIData> {
    return this.http.get<APIData>(this.apiUrl + 'expert/viewSLotRequest').catch(this.errorHandler);

  }
  
  editSlotRequest(request: Request): Observable<APIData> {
    return this.http.patch<APIData>(this.apiUrl + 'expert/editSlotRequest/'+request._id,request).catch(this.errorHandler);
  }

  getUserData(): Observable<APIData> {
    return this.http.get<APIData>(this.apiUrl + 'user/getUserData').catch(this.errorHandler);
  }
  
  login(user:User):Observable<APIData> {
    return this.http.post<APIData>(this.apiUrl + 'auth/login', user).catch(this.errorHandler);
  }
  
  update_Email(profile:Profile):Observable<APIData> {
    return this.http.post<APIData>(this.apiUrl + 'auth/updateEmail', profile).catch(this.errorHandler);
  }

  update_Rating(user:User):Observable<APIData> {
    return this.http.post<APIData>(this.apiUrl + 'user/updateRating', user).catch(this.errorHandler);
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

  loadStatus(): Observable<APIData> {
    return this.http.get<APIData>(this.apiUrl + 'loadStatus').catch(this.errorHandler);
  }

  changeUserStatus(user: User): Observable<APIData> {
    return this.http.post<APIData>(this.apiUrl + 'auth/changeUserStatus', user).catch(this.errorHandler);
  };

  editSpeciality(speciality): Observable<APIData> {
    return this.http.delete<APIData>(this.apiUrl + 'expert/editSpeciality',speciality)
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

  viewSchedule(): Observable<APIData> {
    return this.http.get<APIData>(this.apiUrl + 'getExpertSchedule/5ac202a3205bd50e64b47ea9').catch(this.errorHandler);
  }

  upgradeToExpert(requestData: RequestData): Observable <APIData> {
    return this.http.post<APIData>(this.apiUrl+ 'user/upgradeToExpert', requestData).catch(this.errorHandler);
  }

  addSpeciality(speciality): Observable<APIData> {
    return this.http.post<APIData>(this.apiUrl + 'expert/addSpeciality',{speciality:speciality})
    .catch(this.errorHandler);
  }

  getOfferedSlots(): Observable<APIData> {
    return this.http.get<APIData>(this.apiUrl + 'user/getOfferedSlots').catch(this.errorHandler);
  }
  reserve(offeredSlots:OfferedSlots): Observable<APIData> {
    return this.http.post<OfferedSlots>(this.apiUrl + 'user/reserveSlot',offeredSlots).catch(this.errorHandler);
  }


}
