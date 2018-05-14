import { Component, OnInit, Input, ViewChild , ChangeDetectorRef } from "@angular/core";
import { APIData, User } from '../../@core/service/models/api.data.structure';
import { APIService } from "../../@core/service/api.service";
import { SharedService } from "../../@core/service/shared.service";

@Component({
  selector: 'app-err',
  templateUrl: './template/err.component.html',
  styleUrls: ['./template/err.component.scss']
})
export class ErrComponent implements OnInit {
  public message;

  constructor(private apiService: APIService , private sharedService : SharedService , private ref : ChangeDetectorRef ) {}

  ngOnInit(): void {
    this.sharedService.triggerErrMessage.subscribe( message => {
      this.message = message;
    })
  }
}


