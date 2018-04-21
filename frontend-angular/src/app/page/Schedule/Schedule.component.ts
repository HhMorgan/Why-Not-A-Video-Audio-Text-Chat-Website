import {Component , OnInit} from "@angular/core";
import {APIData , User} from '../../@core/service/models/api.data.structure';
import { APIService  } from "../../@core/service/api.service";

@Component({
  selector: 'app-login',
  templateUrl: './template/Schedule.component.html',
  styleUrls: ['./template/Schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  slots: String []=['No']; 
  constructor(){

    this.assignslots();
    
    }
   
 ngOnInit() {}

addslot(day , hour) {
this.slots[0]= 'Reserved';
this.slots[100]='Reserved';

}


assignslots(){
  this.addslot(0,0);
for( var i=0; i<30; i++){
  for(var j=0; j<14; j++){
 console.log(this.slots[(i*14)+j]);
 if((this.slots[(i*14)+j] === 'Reserved' ) )
  this.slots[(i*14)+j]= 'Reserved';
  else
  this.slots[(i*14)+j]= 'Reserve';

}}
}

Reserve(day , hour) {

var slot=(day*14)+hour;
console.log(this.slots[slot]);
if((this.slots[slot]==='Reserve')){
this.slots[slot] = 'Reserved'; 
console.log(this.slots[slot]);
alert("Your slot has been reserved, Thank you");
//window.location.href="/#/page/rating";
}
else
alert("This slot is already reserved , please choose another one ");
}

book(){
  alert("Thank you. You will be notified with slots that suit the expert");
}
}


