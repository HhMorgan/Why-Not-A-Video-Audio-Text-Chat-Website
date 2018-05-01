import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { APIService } from '../../../@core/service/api.service';
import { APIData } from '../../../@core/service/models/api.data.structure';

@Component({
  selector: 'app-confirm-mail',
  templateUrl: './template/confirm-mail.component.html',
  styleUrls: ['./template/confirm-mail.component.css']
})
export class ConfirmMailComponent implements OnInit {
  response :any ;
  constructor(private apiService:APIService , private route: ActivatedRoute ) {
    this.route.params.subscribe(params => {
      this.apiService.confirmEmail( params.email , params.token).subscribe((apiresponse: APIData) => {
        this.response = apiresponse.msg;
      },(err) =>{
        this.response = err.msg;
      });
    });
   }
  ngOnInit() {
  }
}
