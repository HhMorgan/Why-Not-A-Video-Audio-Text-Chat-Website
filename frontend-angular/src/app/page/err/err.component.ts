import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { APIData, User } from '../../@core/service/models/api.data.structure';
import { APIService } from "../../@core/service/api.service";

@Component({
  selector: 'app-err',
  templateUrl: './template/err.component.html',
  styleUrls: ['./template/err.component.scss']
})
export class ErrComponent implements OnInit {
  @Input() message;
  constructor(private apiService: APIService) {

  }

  ngOnInit() {

  }


}


