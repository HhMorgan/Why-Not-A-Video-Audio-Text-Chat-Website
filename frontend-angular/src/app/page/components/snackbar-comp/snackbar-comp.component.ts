import { Component, OnInit, Input } from '@angular/core';
import { NavBarService } from '../../../@core/service/shared.service';
@Component({
  selector: 'app-snackbar-comp',
  templateUrl: './snackbar-comp.component.html',
  styleUrls: ['./snackbar-comp.component.css']
})
export class SnackbarCompComponent implements OnInit {

  constructor( private NavBarService:NavBarService) {

   

   }

  ngOnInit() {
    this.NavBarService.changenotifications.subscribe((m:any) => {
   //   console.log("lolololo");
    //  console.log(m);
      this.triggernotifications(m.color,m.text);
  })
  }

  triggernotifications(color, text) {
    console.log(color,text);
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");
    console.log(x);
    x.style.backgroundColor = color;
    x.textContent = text;
    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
  }

}


