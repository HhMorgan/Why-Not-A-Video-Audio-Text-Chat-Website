import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';

import * as decodejwt from 'jwt-decode';
import { JwtHelper } from 'angular2-jwt';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { APIData , Tag , Session , Request , CandicateSession , Profile , User , FileData , RequestData , Color , OfferedSlots , ReserveSlotBody , SlotBody , Notification , ExpertAcceptSlotBody, Token, SlotDateBody } from '../service/models/api.data.structure';

@Injectable()
export class APIService {
  public static apiUrl = 'https://whatwhynot.net/api/';
  // public static apiUrl = 'http://127.0.0.1:3000/api/';
  public static apiUrl_Intercept_Ignore_list: Array<String> = ['auth/login', 'auth/signup' , 'auth/verify'];
  constructor( private jwtHelper: JwtHelper , private http: HttpClient) { }

  public static getToken(): string {
    return localStorage.getItem('token');
  }

  public isAuthenticated(): boolean {
    if(APIService.getToken() != null){
      return !this.jwtHelper.isTokenExpired(APIService.getToken());
    } else {
      return false;
    }
  }

  public getToken( getUserData : boolean) : any {
    let tokenPayload = <any> decodejwt(APIService.getToken());
    if(getUserData){
      return <Token> tokenPayload.user;
    } else {
      return tokenPayload;
    }
  }

  errorHandler(apiResponse: HttpErrorResponse) {
    return Observable.throw(apiResponse.error);
  }

  // all the methods here are used to link between the frontend and the backend by
  // using the url of the local host + url of the method that is created in the index
  getTags(): Observable<APIData> {
    return this.http.get<APIData>(APIService.apiUrl + 'Tags/getTags').catch(this.errorHandler);
  }

  getUsers(): Observable<APIData> {
    return this.http.get<APIData>(APIService.apiUrl + 'getUsers').catch(this.errorHandler);
  }

  signup(user: User): Observable<APIData> {
    return this.http.post<APIData>(APIService.apiUrl + 'auth/signup', user).catch(this.errorHandler);
  }

  AddColor(Color: Color): Observable<APIData> {
    return this.http.post<APIData>(APIService.apiUrl + 'CreateAColor', Color).catch(this.errorHandler);
  }

  getColors(): Observable<APIData> {
    return this.http.get<APIData>(APIService.apiUrl + 'getColors').catch(this.errorHandler);
  }

  addColorToTag(Color: Color, Tags: Tag): Observable<APIData> {
    return this.http.post<APIData>(APIService.apiUrl + 'addColorToTag', [Color, Tags])
      .catch(this.errorHandler);
  }

  AddTag(tag: Tag): Observable<APIData> {
    return this.http.post<APIData>(APIService.apiUrl + 'Tags/AddTag', tag).catch(this.errorHandler);
  }

  editTag(tag: Tag): Observable<APIData> {
    return this.http.patch<APIData>(APIService.apiUrl + 'Tag/editTags/' + tag._id, tag)
      .catch(this.errorHandler);
  }

  getTagbyId(Tags_ids: String[]): Observable<APIData> {
    console.log(Tags_ids);
    return this.http.post<APIData>(APIService.apiUrl + 'expert/getTagById', Tags_ids)
      .catch(this.errorHandler);
  }

  getTagbyName(tag: Tag): Observable<APIData> {
    //   console.log(tname);
    return this.http.get<APIData>(APIService.apiUrl + 'expert/getTagByName/' + tag.name)
      .catch(this.errorHandler);
  }

  deleteTags(tag: Tag): Observable<APIData> {
    return this.http.delete<APIData>(APIService.apiUrl + 'Tags/deleteTags/' + tag._id)
      .catch(this.errorHandler);
  }

  getSlotRequests(): Observable<APIData> {
    return this.http.get<APIData>(APIService.apiUrl + 'expert/viewSLotRequest').catch(this.errorHandler);
  }


  editSlotRequest(request: Request): Observable<APIData> {
    return this.http.patch<APIData>(APIService.apiUrl + 'expert/editSlotRequest/' + request._id, request).catch(this.errorHandler);
  }

  getExpert(): Observable<APIData> {
    return this.http.get<APIData>(APIService.apiUrl + 'session/getExpert').catch(this.errorHandler);
  }


  getUserData(): Observable<APIData> {
    return this.http.get<APIData>(APIService.apiUrl + 'user/getUserData').catch(this.errorHandler);
  }

  getUserProfile(user: User): Observable<APIData> {
    return this.http.get<APIData>(APIService.apiUrl + 'user/getUserProfile/' + user.username).catch(this.errorHandler);
  }

  getMatchingUsers(searchtag: String): Observable<APIData> {
    return this.http.get<APIData>(APIService.apiUrl + 'user/getMatchingUsers/' + searchtag).catch(this.errorHandler);
  }

  searchUserbyTags(searchtag: String): Observable<APIData> {
    return this.http.get<APIData>(APIService.apiUrl + 'user/searchUserbyTags/' + searchtag).catch(this.errorHandler);
  }

  searchbyTags(searchtag: String): Observable<APIData> {
    return this.http.get<APIData>(APIService.apiUrl + 'user/searchbyTags/' + searchtag).catch(this.errorHandler);
  }
  
  searchbyUser(username: String): Observable<APIData> {
    return this.http.get<APIData>(APIService.apiUrl + 'user/searchbyUser/' + username).catch(this.errorHandler);
  }

  login(user: User): Observable<APIData> {
    return this.http.post<APIData>(APIService.apiUrl + 'auth/login', user).catch(this.errorHandler);
  }

  update_Email(profile: Profile): Observable<APIData> {
    return this.http.post<APIData>(APIService.apiUrl + 'auth/updateEmail', profile).catch(this.errorHandler);
  }
  update_Password(profile: Profile): Observable<APIData> {
    return this.http.post<APIData>(APIService.apiUrl + 'auth/updatePassword', profile).catch(this.errorHandler);
  }
  update_Desc(profile: Profile): Observable<APIData> {
    return this.http.post<APIData>(APIService.apiUrl + 'auth/updateDescription', profile).catch(this.errorHandler);
  }

  update_Rating(user: User): Observable<APIData> {
    return this.http.post<APIData>(APIService.apiUrl + 'user/updateRating', user).catch(this.errorHandler);
  }

  postFile(fileData: FileData): Observable<APIData> {
    const formData: FormData = new FormData();
    formData.append('file', fileData.file, fileData.file.name);
    return this.http.post<APIData>(APIService.apiUrl + 'photo', formData).catch(this.errorHandler);
  }

  postCoverImg(fileData: FileData): Observable<APIData> {
    const formData: FormData = new FormData();
    formData.append('file', fileData.file, fileData.file.name);
    return this.http.post<APIData>(APIService.apiUrl + 'CoverImgUpload', formData).catch(this.errorHandler);
  }

  getimage(): Observable<APIData> {
    return this.http.get<APIData>(APIService.apiUrl + 'getphoto').catch(this.errorHandler);
  }

  getusername(): Observable<APIData> {
    return this.http.get<APIData>(APIService.apiUrl + 'getusername').catch(this.errorHandler);
  }

  getUsernameOfUser(id: String): Observable<APIData> {
    console.log(id);
    return this.http.get<APIData>(APIService.apiUrl + 'getUsernameOfUser/' + id).catch(this.errorHandler);
  }

  getNotification(): Observable<APIData>{
    return this.http.get<APIData>(APIService.apiUrl + 'Notification/getNotifications').catch(this.errorHandler);
  }

  getMatchingSearch(searchtag: String): Observable<APIData> {
    return this.http.get<APIData>(APIService.apiUrl + 'user/Search/' + searchtag).catch(this.errorHandler);
  }

  loadStatus(): Observable<APIData> {
    return this.http.get<APIData>(APIService.apiUrl + 'loadStatus').catch(this.errorHandler);
  }

  changeUserStatus(user: User): Observable<APIData> {
    return this.http.post<APIData>(APIService.apiUrl + 'auth/changeUserStatus', user).catch(this.errorHandler);
  };

  upgradeToExpert(requestData: RequestData): Observable<APIData> {
    return this.http.post<APIData>(APIService.apiUrl + 'user/upgradeToExpert', requestData).catch(this.errorHandler);
  }

  addSpeciality(tag: Tag): Observable<APIData> {
    return this.http.patch<APIData>(APIService.apiUrl + 'expert/addSpeciality/' + tag._id, tag)
      .catch(this.errorHandler);
  }

  editSpeciality(tag: Tag): Observable<APIData> {
    return this.http.delete<APIData>(APIService.apiUrl + 'expert/editSpeciality/' + tag._id)
      .catch(this.errorHandler);
  }

  viewSuggestedExperts(tag: Tag): Observable<APIData> {
    return this.http.get<APIData>(APIService.apiUrl + 'user/viewSuggestedExperts/' + tag.name).catch(this.errorHandler);
  }

  blockUser(Users: User): Observable<APIData> {
    return this.http.patch<APIData>(APIService.apiUrl + 'User/blockUser/' + Users._id, Users)
      .catch(this.errorHandler);
  }

  downgradeExpert(Users: User): Observable<APIData> {
    return this.http.patch<APIData>(APIService.apiUrl + 'User/downgradeExpert/' + Users._id, Users)
      .catch(this.errorHandler);
  }

  BlockAndUnblock(Users: User): Observable<APIData> {
    return this.http.patch<APIData>(APIService.apiUrl + 'User/BlockAndUnblock/' + Users._id, Users)
      .catch(this.errorHandler);
  }

  ChangeRole(Users: User): Observable<APIData> {
    return this.http.patch<APIData>(APIService.apiUrl + 'User/ChangeRole/' + Users._id, Users)
      .catch(this.errorHandler);
  }

  getSchedule(user: User): Observable<APIData> {
    return this.http.get<APIData>(APIService.apiUrl + 'schedule/' + user._id).catch(this.errorHandler);
  }

  getScheduleWeeklySlots(date : any): Observable<APIData> {
    return this.http.post<APIData>(APIService.apiUrl + 'schedule' , { date : date } ).catch(this.errorHandler);
  }

  userReserveSlot(reserveSlotBody: ReserveSlotBody): Observable<APIData> {
    return this.http.post<APIData>(APIService.apiUrl + 'schedule/userReserveSlot', reserveSlotBody).catch(this.errorHandler);
  }

  expertOfferSlot( slotDateBody : SlotDateBody): Observable<APIData> {
    return this.http.post<APIData>(APIService.apiUrl + 'schedule/expertOfferSlot', slotDateBody).catch(this.errorHandler);
  }

  expertCancelSlot(slotDateBody : SlotDateBody): Observable<APIData> {
    return this.http.post<APIData>(APIService.apiUrl + 'schedule/expertCancelSlot', slotDateBody ).catch(this.errorHandler);
  }

  expertAcceptSlot(expertAcceptSlotBody: ExpertAcceptSlotBody): Observable<APIData> {
    return this.http.post<APIData>(APIService.apiUrl + 'schedule/expertAcceptSlot', expertAcceptSlotBody).catch(this.errorHandler);
  }

  addtoToBookmark(User: User): Observable<APIData> {
    return this.http.post<APIData>(APIService.apiUrl + 'user/addToBookmarks/' + User._id, User._id)
      .catch(this.errorHandler);
  }

  removeFromBookmark(User: User): Observable<APIData> {
    return this.http.delete<APIData>(APIService.apiUrl + 'user/removeFromBookmarks/' + User._id)
      .catch(this.errorHandler);
  }

  getUsersbyIds(Users_ids: String[]): Observable<APIData> {
    return this.http.post<APIData>(APIService.apiUrl + 'users/getById', { ids : Users_ids }).catch(this.errorHandler);
  }

//-----------------------------------/getRequestsFromUsersToBeExpert api request/--------------------------

  getRequestsFromUsersToBeExpert(): Observable<APIData> {
    return this.http.get<APIData>(APIService.apiUrl + 'User/getUserRequestToBeExpert').catch(this.errorHandler);
  }
  verify( token : string ): Observable<APIData> {
    return this.http.get<APIData>(APIService.apiUrl + 'auth/verify/' + token ).catch(this.errorHandler);
  }

}