import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { APIData , Profile , User,FileData} from '../service/models/api.data.structure';

import { HttpClient , HttpHeaders  , HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class APIService {
  private apiUrl = 'http://localhost:3000/api/';
  public static apiUrl_Intercept_Ignore_list: Array<String> = ['auth/login','auth/register'/*,'getphoto'*/];
  constructor(private http: HttpClient) {}

  errorHandler(error: HttpErrorResponse) {
    return Observable.throw(error.message || "Server Error");
  }

  login(user:User):Observable<APIData>{
    return this.http.post<User>(this.apiUrl + 'auth/login', user)
    .catch(this.errorHandler);
  }

  update_Email(profile:Profile):Observable<APIData>{
    console.log(profile.email)
    return this.http.post<Profile>(this.apiUrl + 'auth/updateEmail', profile)
    .catch(this.errorHandler);
  }

  postFile(fileData: FileData): Observable<APIData> {
    const formData: FormData = new FormData();
    formData.append('file', fileData.file, fileData.file.name);
    return this.http.post<APIData>(this.apiUrl + 'photo', formData).catch(this.errorHandler);
  }

  getimage(): Observable<APIData> {
    return this.http.get<APIData>(this.apiUrl + 'getphoto').catch(this.errorHandler);
  }

  changeUserStatus(user: User): Observable<APIData>
  {
    return this.http.post<APIData>(this.apiUrl + 'auth/changeUserStatus', user).catch(this.errorHandler);
  };

  public static getToken() : string {
    return localStorage.getItem('token');
  }

}
