import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';

import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders  , HttpErrorResponse } from '@angular/common/http';
import { APIData , SlotData , Tags , Session , Request , CandicateSession , Profile , User , FileData , RequestData , OfferedSlots, ReserveSlotBody,OfferSlotBody, Notification } from '../service/models/api.data.structure';

@Injectable()
export class APIService {
  public static apiUrl = 'http://localhost:3000/api/';
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
     return this.http.get<APIData>( APIService.apiUrl + 'Tags/getTags').catch(this.errorHandler);
  }

  getUsers(): Observable<APIData> {
    return this.http.get<APIData>(APIService.apiUrl + 'getUsers').catch(this.errorHandler);
 }
  
  signup(user:User):Observable<APIData> {
    return this.http.post<APIData>( APIService.apiUrl + 'auth/signup', user).catch(this.errorHandler);
  }

  
  AddTag(Tags:Tags): Observable<APIData> {
    return this.http.post<APIData>( APIService.apiUrl + 'Tags/AddTag', Tags).catch(this.errorHandler);
  }

  editTag(Tags:Tags):Observable<APIData> {
    return this.http.patch<APIData>( APIService.apiUrl + '/Tag/editTags/'+Tags._id,Tags)
    .catch(this.errorHandler);
  }

  getTagbyId(Tags_ids: String[]):Observable<APIData> {
    console.log(Tags_ids);
    return this.http.get<APIData>( APIService.apiUrl + 'expert/getTagById/'+Tags_ids)
    .catch(this.errorHandler);
  }

  deleteTags(Tags:Tags):Observable<APIData> {
    return this.http.delete<APIData>( APIService.apiUrl + '/Tags/deleteTags/'+Tags._id)
    .catch(this.errorHandler);
  }

  getSlotRequests(): Observable<APIData> {
    return this.http.get<APIData>( APIService.apiUrl + 'expert/viewSLotRequest').catch(this.errorHandler);
  }
 
 
 editSlotRequest(request: Request): Observable<APIData> {
  return this.http.patch<APIData>( APIService.apiUrl+'expert/editSlotRequest/'+request._id,request).catch(this.errorHandler);
 }

  getExpert(): Observable<APIData> {
   return this.http.get<APIData>( APIService.apiUrl + 'session/getExpert').catch(this.errorHandler);
  }


  getUserData(): Observable<APIData> {
    return this.http.get<APIData>( APIService.apiUrl + 'user/getUserData').catch(this.errorHandler);
  }

  getpassword(): Observable<APIData> {
    return this.http.get<APIData>(APIService.apiUrl + 'user/getpassword').catch(this.errorHandler);
  }


  getUserProfile(user:User): Observable<APIData> {
    return this.http.get<APIData>(APIService.apiUrl + 'user/getUserProfile/'+user.username).catch(this.errorHandler);
  }

  getMatchingUsers(searchtag:String): Observable<APIData> {
    return this.http.get<APIData>(APIService.apiUrl + 'user/getMatchingUsers/'+ searchtag).catch(this.errorHandler);
  }

  login(user:User):Observable<APIData> {
    return this.http.post<APIData>( APIService.apiUrl + 'auth/login', user).catch(this.errorHandler);
  }
  
  update_Email(profile:Profile):Observable<APIData> {
    return this.http.post<APIData>( APIService.apiUrl + 'auth/updateEmail', profile).catch(this.errorHandler);
  }
  update_Password(profile:Profile):Observable<APIData> {
    return this.http.post<APIData>(APIService.apiUrl + 'auth/updatePassword', profile).catch(this.errorHandler);
  }
  update_Desc(profile:Profile):Observable<APIData> {
    return this.http.post<APIData>(APIService.apiUrl + 'auth/updateDescription', profile).catch(this.errorHandler);
  }

  update_Rating(user:User):Observable<APIData> {
    return this.http.post<APIData>( APIService.apiUrl + 'user/updateRating', user).catch(this.errorHandler);
  }

  postFile(fileData: FileData): Observable<APIData> {
    const formData: FormData = new FormData();
    formData.append('file', fileData.file, fileData.file.name);
    return this.http.post<APIData>( APIService.apiUrl + 'photo', formData).catch(this.errorHandler);
  }

  getimage(): Observable<APIData> {
    return this.http.get<APIData>( APIService.apiUrl + 'getphoto').catch(this.errorHandler);
  }

  getusername(): Observable<APIData> {
    return this.http.get<APIData>(APIService.apiUrl + 'getusername').catch(this.errorHandler);
  }
  getUsernameOfUser(id:String): Observable<APIData> {
    console.log(id);
    return this.http.get<APIData>(APIService.apiUrl + 'getUsernameOfUser/'+id).catch(this.errorHandler);
  }
  chooseSlot(slotData:SlotData): Observable<APIData>{
    console.log(slotData);
   return this.http.post<APIData>( APIService.apiUrl + 'expert/chooseSlot' , slotData).catch(this.errorHandler);
 
  }

  addCandidate( sessionData : CandicateSession ): Observable<APIData> {
    return this.http.post<APIData>(  APIService.apiUrl + 'session/updateCandidate', sessionData)
    .catch(this.errorHandler);
  }

  loadStatus(): Observable<APIData> {
    return this.http.get<APIData>( APIService.apiUrl + 'loadStatus').catch(this.errorHandler);
  }

  changeUserStatus(user: User): Observable<APIData> {
    return this.http.post<APIData>( APIService.apiUrl + 'auth/changeUserStatus', user).catch(this.errorHandler);
  };

  editSpeciality(Tags:Tags,speciality): Observable<APIData> {
    return this.http.delete<APIData>(APIService.apiUrl + 'expert/editSpeciality/'+Tags._id)
    .catch(this.errorHandler);
  }

  updateSessionCandidates( sessionData : CandicateSession ): Observable<APIData> {
    return this.http.post<APIData>(  APIService.apiUrl + 'session/updateCandidate', sessionData)
    .catch(this.errorHandler);
  }

  getSessionCandidatesRTCDes( session : Session ) {
    return this.http.post<APIData>(  APIService.apiUrl + 'session/getCandidatesRTCDes/' + session.sessionId , session)
    .catch(this.errorHandler);
  }

  upgradeToExpert(requestData: RequestData): Observable <APIData> {
    return this.http.post<APIData>( APIService.apiUrl+ 'user/upgradeToExpert', requestData).catch(this.errorHandler);
  }

  addSpeciality(speciality): Observable<APIData> {
    return this.http.post<APIData>( APIService.apiUrl + 'expert/addSpeciality',{speciality:speciality})
    .catch(this.errorHandler);
  }

  getOfferedSlots(): Observable<APIData> {
    return this.http.get<APIData>( APIService.apiUrl + 'user/getOfferedSlots').catch(this.errorHandler);
  }
  reserve(offeredSlots:OfferedSlots): Observable<APIData> {
    return this.http.post<OfferedSlots>( APIService.apiUrl + 'user/reserveSlot',offeredSlots).catch(this.errorHandler);
  }

  viewSuggestedExperts(tag:Tags):Observable<APIData>{
    return this.http.get<Tags>( APIService.apiUrl + 'user/viewSuggestedExperts/'+ tag.name).catch(this.errorHandler);
  }

  BlockAndUnblock(Users:User):Observable<APIData>{
    return this.http.patch<APIData>( APIService.apiUrl + 'User/BlockAndUnblock/'+Users._id,Users)
    .catch(this.errorHandler);
  }
  ChangeRole(Users:User):Observable<APIData>{
    return this.http.patch<APIData>( APIService.apiUrl + 'User/ChangeRole/'+Users._id,Users)
    .catch(this.errorHandler);
  }

  getSchedule( user : User ) : Observable<APIData> {
    return this.http.get<APIData>( APIService.apiUrl + 'schedule/' + user._id ).catch(this.errorHandler);
  }

  userReserveSlot( reserveSlotBody : ReserveSlotBody ) :Observable<APIData> {
    return this.http.post<APIData>( APIService.apiUrl + 'schedule/userReserveSlot' , reserveSlotBody ).catch(this.errorHandler);
  }
  expertOfferSlot( offerSlotBody : OfferSlotBody ) :Observable<APIData> {
    return this.http.post<APIData>( APIService.apiUrl + 'schedule/expertOfferSlot' , offerSlotBody ).catch(this.errorHandler);
  }
}
