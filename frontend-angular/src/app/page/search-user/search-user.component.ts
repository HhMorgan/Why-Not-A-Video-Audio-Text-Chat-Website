import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APIService } from '../../@core/service/api.service';
import { NavBarService } from '../../@core/service/shared.service';
import { APIData, User, Tag } from '../../@core/service/models/api.data.structure';
import { IAlert } from '../../@core/service/models/frontend.data.structure';
import { Routes, Router } from '@angular/router';
import { NotificationComponent } from '../components/notification/notification.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {NgxPaginationModule} from 'ngx-pagination';
@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.css'],
})
export class SearchUserComponent implements OnInit {
 // private searchtag;
  private users: User[];
  private tags: Tag[];
  public alerts: Array<IAlert> = [];
  closeResult: string;

  // paged items
 pagedItems: any[];
   p: number = 1;

   @Input() showUsers:boolean ;
   @Input() showCover:boolean  ;
   @Input() searchtag:string ;



  constructor(private apiServ: APIService, private route: ActivatedRoute, private router: Router, private modalService: NgbModal, private  NavBarService:NavBarService) {
  }





  ngOnInit() {
    console.log(this.showCover);

    if(this.showUsers != false && this.showCover != false ){
      this.showUsers=true;
      this.showCover=true;
    }
   
   
   
    this.route.params.subscribe(params => {  //this method passes the username paramter in URL to the page
   
      if(params['searchtag']==null){
        this.NavBarService.searchevent.subscribe((m:any) => {
          //   console.log("lolololo");
           //  console.log(m);
             this.searchtag=m;
            this.SearchByTag( this.searchtag);
             
         })
        }
        else{
          this.searchtag = params['searchtag'];
          this.search( this.searchtag);
        }

   
    

    });





  }

  search(seathtag){
    var i, j;
    this.apiServ.getMatchingSearch(seathtag).subscribe((apires: APIData) => {
      this.users = new Array();
      this.tags = new Array();
      // var UsersData = new Array(apires.data[1]);
      console.log(apires);
      for (i = 0; i < apires.data[1].length; i++) {
        this.users.push((apires.data[1])[i]);
        this.getimageuser((apires.data[1])[i].username, (apires.data[1])[i].img);
      }


      for (j = 0; j < apires.data[0].length; j++) {
        this.tags.push((apires.data[0])[j]);
        var Tag = document.getElementById(((apires.data[0])[j])._id) as HTMLImageElement;
      }
    })

  }

  SearchByTag(seathtag){
    var i, j;
    this.apiServ.getMatchingSearch(seathtag).subscribe((apires: APIData) => {
      this.tags = new Array();
      for (j = 0; j < apires.data[0].length; j++) {
        this.tags.push((apires.data[0])[j]);
        var Tag = document.getElementById(((apires.data[0])[j])._id) as HTMLImageElement;
      }
    })

  }

  
  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getimageuser(name, datain) {
    var reader: FileReader = new FileReader();
    reader.readAsDataURL(new Blob([new Buffer(datain.data)], { type: datain.data.contentType }))
    reader.addEventListener("load", function () {
      var profileimg = document.getElementById(name) as HTMLImageElement;
      if (profileimg != null) {
        profileimg.src = reader.result;
      }

      // navbarimg.src = reader.result;
    }, false);
  }
  AddTag() {
    var tag = <Tag>{};
    var icon = event.target as HTMLElement
    var parentDiv = icon.parentElement as HTMLElement
    var parentDirowClass = parentDiv.parentElement as HTMLElement
    var parentDirowClass2 = parentDirowClass.parentElement as HTMLElement
    var firstDivOfRows = parentDirowClass.firstElementChild as HTMLElement
    var TagBtn = firstDivOfRows.firstElementChild as HTMLElement
    for( let currentTag of this.tags ){
      if(TagBtn.textContent == currentTag.name ){
        tag._id = currentTag._id;
        break;
      }
    }
    tag.name = TagBtn.textContent;
    //sends the tag name through addSpeciality which is later used to search for the tag and add it
    this.apiServ.addSpeciality(tag).subscribe((apiresponse: APIData) => {
      this.NavBarService.triggernotifcations("#34A853", apiresponse.msg.toString());
    }, (err) => {
      this.NavBarService.triggernotifcations("#EA4335", err.msg);
    });
  }
  refresh() {
    if (this.users != null) {
      this.ngOnInit();
    }

  }

  RequestTag() {
    // to be implemented
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