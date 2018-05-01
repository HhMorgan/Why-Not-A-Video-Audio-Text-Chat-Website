import { Component, OnInit,Input,ViewChild } from "@angular/core";
import { APIData, User} from '../../@core/service/models/api.data.structure';
import { APIService } from "../../@core/service/api.service";
import * as moment from 'moment';
import { error } from "util";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-errTest',
  templateUrl: './template/errTest.component.html',
  styleUrls: ['./template/errTest.component.scss']
})
export class ErrTestComponent implements OnInit {
  messageTest="ERRor 404 NOT FOUND";
  constructor(private apiService: APIService) {
   
  }

  ngOnInit() {
   
  }

 
}


