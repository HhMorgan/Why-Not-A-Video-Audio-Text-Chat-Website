import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { APIService } from '../../../@core/service/api.service';
import { APIData } from '../../../@core/service/models/api.data.structure';

@Component({
  selector: 'app-verify',
  templateUrl: './template/verify.component.html',
  styleUrls: ['./template/verify.component.css']
})
export class VerifyComponent implements OnInit {
  public response :any ;
  constructor(private apiService:APIService , private route: ActivatedRoute ) {
    this.route.params.subscribe(params => {
      this.apiService.verify(params.token).subscribe((apiresponse: APIData) => {
        this.response = apiresponse.msg;
      },(err) =>{
        this.response = err.msg;
      });
    });
   }
  ngOnInit() {
  }
}
