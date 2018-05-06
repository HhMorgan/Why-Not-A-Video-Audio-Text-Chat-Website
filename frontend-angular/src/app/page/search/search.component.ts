import { ActivatedRoute } from '@angular/router';
import { APIService } from '../../@core/service/api.service';
import { NavBarService, SharedFunctions } from '../../@core/service/shared.service';
import { APIData, User, Tag } from '../../@core/service/models/api.data.structure';
import { IAlert } from '../../@core/service/models/frontend.data.structure';
import { Routes, Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NotificationComponent } from '../components/notification/notification.component';
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, SimpleChange, OnChanges } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './template/search.component.html',
  styleUrls: ['./template/search.component.css'],
})
export class SearchComponent implements OnInit,OnChanges {

  @Input() showUsers: boolean;
  @Input() showCover: boolean;
  @Input() searchtag: string;
  @Input() showTags: boolean;
  @Input() searchParms : String;

  public users: User[];
  public tags: Tag[];
  public alerts: Array<IAlert> = [];
  public closeResult: string;
  private searchBy: string;
  public pagedItems: any[];
  public p: number = 1;
  public p2: number = 1;

  constructor(private apiServ: APIService, private route: ActivatedRoute, private router: Router, 
    private modalService: NgbModal, private NavBarService: NavBarService) {
  }

  ngOnInit() {
    if (this.showUsers != false && this.showCover != false && this.showTags != true) {
      this.showUsers = true;
      this.showCover = true;
      this.showTags = false;
    }


    //uses the search parameter in the url to search
    this.route.params.subscribe(params => {  //this method passes the username paramter in URL to the page
      //as i'm using this in the add/edit speciality in the profile 
      // user doesn't actually search from the url so the searchtag is always null if it's from the profile
      //using the service i can communicate with the comp. (navbar)     
      console.log(params)
      console.log('------------------------------') 
      this.tags = new Array();
      this.users = new Array();
      switch(params['searchOptions']){
        case "Users":
        if(params['search'] != null){
          this.apiServ.searchbyUser(params['search']).subscribe((apires: APIData) => {
            for (var i = 0; i < apires.data.length; i++) {
              this.users.push((apires.data)[i]);
              SharedFunctions.loadImageBy(apires.data[i].username , (apires.data)[i].img , false)
            }
          }, (err) => {
            this.NavBarService.triggernotifcations("#EA4335", err.msg);
          })
        }
        break;
        case "TaggedUsers":
          if(params['search'] != null){
            this.apiServ.viewSuggestedExperts(<Tag>{ name : params['search'] }).subscribe((apires: APIData) =>{
              for (var i = 0; i < apires.data.length; i++) {
                this.users.push(apires.data[i]);
                SharedFunctions.loadImageBy(apires.data[i].username , (apires.data)[i].img , false)
              }
            },(err) =>{
              this.NavBarService.triggernotifcations("#EA4335", err.msg);
            });
          }
          break;
        default:
      }
    });
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }): void {
    for (let propName in changes) {
      switch (propName) {
        case "searchParms":
          if(this.searchParms && this.searchParms.length != 0){
            this.apiServ.searchbyTags(this.searchParms).subscribe((apires: APIData) => {
              this.tags = new Array();
              for (var j = 0; j < apires.data.length; j++) {
                this.tags.push((apires.data)[j]);
                var Tag = document.getElementById(((apires.data)[j])._id) as HTMLImageElement;
              }
            },(err) =>{
              this.NavBarService.triggernotifcations("#EA4335", err.msg);
            })
          }
        break;
      }
    }
  }

  //this function is responsible for adding the user to bookmarks
  // firstly i get the event target which is the button that it's clicked
  // then gets the username by moving back and forth between children and parents to get the element
  // lastly cnnect to database and show a pop up
  addtobookmark() {
    var button = event.target as HTMLElement
    var parentDiv = button.parentElement as HTMLElement
    var parentDirowClass = parentDiv.parentElement as HTMLElement
    var childdiv = parentDirowClass.childNodes[3] as HTMLElement
    var firstChildDiv = childdiv.firstElementChild as HTMLElement
    var name = firstChildDiv.firstElementChild as HTMLElement
    var user = <User>{};
    user.username = name.innerText.toLowerCase();
    this.apiServ.getUserProfile(user).subscribe((apires: APIData) => {
      this.apiServ.addtoToBookmark(apires.data).subscribe((apires: APIData) => {
        this.NavBarService.triggernotifcations("#34A853", apires.msg.toString());
      }, (err) => {
        this.NavBarService.triggernotifcations("#EA4335", err.msg);
      })
    });
  }

  //this method is used to open the mobal (from it's service)
  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  //this method is used to open the getDismissReason (from it's service)
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  //this function is responsible for adding the user to tags to the expert
  // firstly i get the event target which is the button that it's clicked
  // then gets the tag's name by moving back and forth between children and parents to get the element
  // lastly cnnect to database and show a pop up
  AddTag() {
    var tag = <Tag>{};
    var icon = event.target as HTMLElement
    var parentDiv = icon.parentElement as HTMLElement
    var parentDirowClass = parentDiv.parentElement as HTMLElement
    var parentDirowClass2 = parentDirowClass.parentElement as HTMLElement
    var firstDivOfRows = parentDirowClass.firstElementChild as HTMLElement
    var TagBtn = firstDivOfRows.firstElementChild as HTMLElement
    for (let currentTag of this.tags) {
      if (TagBtn.textContent == currentTag.name) {
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
  
  RequestTag() {
    var tag_Request = <Tag>{};
    tag_Request.name = (document.getElementById("RequestingTag") as HTMLInputElement).value;
    tag_Request.status = 'Pending';
    tag_Request.blocked = false;
    this.apiServ.AddTag(tag_Request).subscribe((apiresponse: APIData) => {
      this.NavBarService.triggernotifcations("#34A853", "Your request was sent sucessfully");
    });
  }
}
