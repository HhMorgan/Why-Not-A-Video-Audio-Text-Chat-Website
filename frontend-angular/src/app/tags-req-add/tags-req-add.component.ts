import { Component, OnInit ,Input} from '@angular/core';
import { APIData  , User ,FileData,Profile , Tags} from '../@core/service/models/api.data.structure'
import { IAlert } from '../@core/service/models/frontend.data.structure'
import { APIService } from '../@core/service/api.service';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { LocalDataSource } from 'ng2-smart-table';
import {NgbAlertConfig} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-tags-req-add',
  templateUrl: './tags-req-add.component.html',
  styleUrls: ['./tags-req-add.component.css']
})
export class TagsReqAddComponent implements OnInit {

  constructor(private apiServ:APIService) { }
  source: LocalDataSource = new LocalDataSource();
  settings = {
    pager:{
      display: true ,
      perPage: 5,
    },

  actions:{
    add: false,
    edit: false,
     delete: false,
     columnTitle: '',
     position: 'right',
// Initializing the custom buttons for the ng2smarttable
    custom: [{
      name:'add', 
      title: `<i class="fa fa-check" aria-hidden="true"></i> `
    } ]
    
    },
  columns: {
// Initializing the columns with their name and type and whether they are selectable
// when adding or editing the columns or not.        
    name: {
      title: 'Name',
      type: 'string',
      
    },
   
  }
};

  ngOnInit() {
    this.refresh();
  }

  


  custom(event):void{
    if(event.action == 'add'){
      this.OnAdd(event);
    }
  }

  //this method is invoked when the user presses the custom made button add
  OnAdd(event): void {
  var Tags = <Tags>{};
  Tags = event.data;
//sends the tag name through addSpeciality which is later used to search for the tag and add it
 
    this.apiServ.addSpeciality(Tags.name).subscribe((apiresponse: APIData)=>{
      this.refresh();
    });
}

refresh(): void {
  // we call the method getTags through the api.service and then loop on all the 
  // recived data and add it to the ng2smarttable
    this.apiServ.getTags().subscribe((apiresponse: APIData)=>{
      for (var i = 0 ; i < apiresponse.data.length ; i++ )
      console.log("loly");
        console.log(apiresponse.data);
      this.source.load(apiresponse.data);
    });
  }

/*   public closeAlert(alert: IAlert) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  } */

  



}
