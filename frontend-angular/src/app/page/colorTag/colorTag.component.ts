import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { APIService } from '../../@core/service/api.service';
import { APIData, Tag, Color } from '../../@core/service/models/api.data.structure';
import { LocalDataSource } from 'ng2-smart-table';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { NgxPaginationModule } from 'ngx-pagination';
@Component({
  selector: 'app-colorTag',
  templateUrl: './colorTag.component.html',
  styleUrls: ['./colorTag.component.css']
})

export class ColorTagComponent implements OnInit {
  public pagedItemstags: any[];
  public tagswithColors: Tag[];
  public colors: string[];
  public ptags: number = 1;
  public p: number = 1;

  ngOnInit() {
    // we call refresh to load data on entery of the page
    this.refresh();
  }

  // this is a constructor for all the APIServices in the pages
  constructor(private _apiService: APIService) { }

  refresh(): void {
    this.tagswithColors = new Array();
    this.colors = new Array();
    // we call the method getTags through the api.service and then loop on all the 
    // recived data and add it to the ng2smarttable
    this._apiService.getTags().subscribe((apiresponse: APIData) => {
      for (var i = 0; i < apiresponse.data.length; i++) {
        this.tagswithColors.push(apiresponse.data[i]);
      }
    });

    this._apiService.getColors().subscribe((apiresponse: APIData) => {
      for (var i = 0; i < apiresponse.data.length; i++) {
        this.colors.push(apiresponse.data[i].name);
      }
    });
  }

  refreshColorTags() {
    this.tagswithColors = new Array();
    this.colors = new Array();
    // we call the method getTags through the api.service and then loop on all the 
    // recived data and add it to the ng2smarttable
    this._apiService.getTags().subscribe((apiresponse: APIData) => {
      for (var i = 0; i < apiresponse.data.length; i++) {
        this.tagswithColors.push(apiresponse.data[i]);
        // this.colors.push(apiresponse.data[i].color);
      }

    });

    this._apiService.getColors().subscribe((apiresponse: APIData) => {
      for (var i = 0; i < apiresponse.data.length; i++) {
        this.colors.push(apiresponse.data[i].name);
      }
    });
  }

  AddColor() {
    var Color = <Color>{};
    Color.name = ((document.getElementById("colorcode") as HTMLInputElement).value);
    // we check if the tag is not accepted if it is not we change it's status through edit tags
    //to accepted otherwise we say the tag is already accepted and we don't change the data   
    this.refreshColorTags();
    this._apiService.AddColor(Color).subscribe((apiresponse: APIData) => {
      this.triggernotifications("#34A853", apiresponse.msg);
      this.refresh();
    });
  }


  AddColorToTag(tag: any, color: string) {
    this._apiService.addColorToTag(<Color>{ name: color }, <Tag>{ name: tag.name }).subscribe((apiresponse: APIData) => {
      this.refreshColorTags();
      this.triggernotifications("#34A853", apiresponse.msg);
    });
  }

  triggernotifications(color, text) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");
    x.style.backgroundColor = color;
    x.textContent = text;
    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
  }
}