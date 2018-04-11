import { Component, OnInit } from '@angular/core';
import { APIService } from '../../@core/service/api.service';
import { APIData  , User  } from '../../@core/service/models/api.data.structure'

@Component({
    selector: 'app-profile',
    templateUrl: './template/profile.component.html',
    styleUrls: ['./template/profile.component.scss']
})

export class ProfileComponent implements OnInit {
    private user =<User>{};

    constructor(private apiServ:APIService) { }

    changeUserStatus()
        {
          if(this.user.onlineStatus){
            this.user.onlineStatus = false;
          } else
            this.user.onlineStatus = true;
      
          this.user.email = 't@h.com'
          this.apiServ.changeUserStatus(this.user).subscribe((apiresponse:APIData)=>
          {
            console.log(apiresponse);
          })
        }

    ngOnInit() {}

}
