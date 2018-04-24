import {Component , OnInit} from "@angular/core";
import {APIData , User} from '../../@core/service/models/api.data.structure';
import { APIService  } from "../../@core/service/api.service";
declare var jquery:any;
import * as $ from 'jquery';

@Component({
  selector: 'app-about',
  templateUrl: './template/about.component.html',
  styleUrls: ['./template/about.component.scss']
})
export class AboutComponent implements OnInit {
  
  constructor(){
   
    }
 
   
 ngOnInit() {
      
 }
 
}


