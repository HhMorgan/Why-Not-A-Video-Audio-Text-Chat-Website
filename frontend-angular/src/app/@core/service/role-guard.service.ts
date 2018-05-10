import { Injectable } from '@angular/core';
import { 
  Router,
  CanActivate,
  ActivatedRouteSnapshot
} from '@angular/router';
import { APIService } from './api.service';
import { JwtHelper } from 'angular2-jwt';
import * as decode from 'jwt-decode';
import { SharedService } from './shared.service';

@Injectable()
export class RoleGuardService implements CanActivate {
  constructor(public apiService: APIService , public sharedService : SharedService, public router: Router) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const checkRole = route.data.checkRole;
    const expectedRole = route.data.expectedRole;
    if(this.apiService.isAuthenticated()){
      let tokenPayload = <any> decode(APIService.getToken());
      if ( checkRole && tokenPayload.user.role != expectedRole ) {
        this.sharedService.triggerErrorPageMessage('Only An ' + expectedRole +' Can Access this Page')
        this.router.navigate(['/page/err']);
        return false;
      }
      return true;
    } else {
      this.router.navigate(['/page/login']);
      return false;
    }
  }
}