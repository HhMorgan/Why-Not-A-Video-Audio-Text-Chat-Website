import { Component, OnInit } from '@angular/core';
import {APIService} from '../../@core/service/api.service';
import {APIData} from '../../@core/service/models/api.data.structure';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'date-picker',
  templateUrl: './template/date-picker.component.html',
  styleUrls: ['./template/date-picker.component.css']
})
export class DatePickerComponent implements OnInit {
  private scheduleDate1;
  private scheduleDate2; 
  private scheduleDate3; 
  private slotTime1;
  private slotTime2;
  private slotTime3;

constructor(private _apiService:APIService) { }

  ngOnInit() {
  }
  //---Method confirming the chosen slots
  confirmClick(){
    if(this.scheduleDate1 == null){
      console.log("hi");
    }else{
      console.log(this.slotTime1);
   
      // this._apiService.chooseSlot({expertName:'',slotDate1: this.scheduleDate1,slotTime1: this.slotTime1,slotDate2:this.scheduleDate2 ,slotTime2:this.slotTime2,slotDate3:this.scheduleDate3,slotTime3:this.slotTime3}).subscribe((apiresponse:APIData)=>(console.log(apiresponse)))
    this._apiService.chooseSlot({slotDate1: this.scheduleDate1,slotTime1: this.slotTime1,slotDate2:this.scheduleDate2 ,slotTime2:this.slotTime2,slotDate3:this.scheduleDate3,slotTime3:this.slotTime3}).subscribe((apiresponse:APIData)=>(console.log(apiresponse)))
      
    }
  }

}
