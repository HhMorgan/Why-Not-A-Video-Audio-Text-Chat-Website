import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APIService } from '../../@core/service/api.service';
import { NavBarService } from '../../@core/service/shared.service';
import { APIData, User, Tag } from '../../@core/service/models/api.data.structure';
import { IAlert } from '../../@core/service/models/frontend.data.structure';
import { Routes, Router } from '@angular/router';
import { NotificationComponent } from '../components/notification/notification.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
@Component({
  selector: 'app-search',
  templateUrl: './template/search.component.html',
  styleUrls: ['./template/search.component.css'],
})
export class SearchComponent implements OnInit {
  private users: User[];
  private tags: Tag[];
  public alerts: Array<IAlert> = [];
  closeResult: string;
  private searchBy: string;
  // paged items
  pagedItems: any[];
  p: number = 1;
  p2: number = 1;

  @Input() showUsers: boolean;
  @Input() showCover: boolean;
  @Input() searchtag: string;
  @Input() showTags: boolean;


  constructor(private apiServ: APIService, private route: ActivatedRoute, private router: Router, private modalService: NgbModal, private NavBarService: NavBarService) {
  }

  ngOnInit() {

    this.searchByValue();
    this.NavBarService.refreshsearch.subscribe((m: any) => {
      console.log(m);
      this.ngOnInit();
    })
    if (this.searchBy === undefined)
      this.searchBy = "UserTags";
    console.log(this.showCover);
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
      if (params['searchtag'] == null) {
        this.NavBarService.searchevent.subscribe((m: any) => {
          //   console.log("lolololo");
          //console.log(m);
          this.searchtag = m;
          this.SearchByTag(this.searchtag);

        })
      }
      else {
        // else he's searching by the url
        this.searchtag = params['searchtag'];
        this.search(this.searchtag);
      }
    });
  }

  //gets the value of the dropdown from the navbar component
  searchByValue() {
    this.NavBarService.searcheventBy.subscribe((m: any) => {
      console.log(m);
      var searchBy = "";
      this.searchBy = m;

    })
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
  //takes a paramater searchtag to see which tag type i search for
  search(seathtag) {
    var i, j;
    console.log(this.searchBy);
    //every if is almost the same iteration over the data and push to an array that later used to show the users/tags
    if (this.searchBy == "UserTags") {
      this.apiServ.searchUserbyTags(seathtag).subscribe((apires: APIData) => {
        this.users = new Array();
        this.tags = new Array();
        for (i = 0; i < apires.data.length; i++) {
          this.users.push((apires.data)[i]);
          this.getimageuser((apires.data)[i].username, (apires.data)[i].img);
        }
      }, (err) => {
        this.NavBarService.triggernotifcations("#EA4335", err.msg);
      })

    }

    else if (this.searchBy == "User") {
      this.apiServ.searchbyUser(seathtag).subscribe((apires: APIData) => {
        this.users = new Array();
        this.tags = new Array();
        for (i = 0; i < apires.data.length; i++) {
          this.users.push((apires.data)[i]);
          this.getimageuser((apires.data)[i].username, (apires.data)[i].img);
        }
      }, (err) => {
        this.NavBarService.triggernotifcations("#EA4335", err.msg);
      })

    }

    else if (this.searchBy == "Tags") {
      this.apiServ.searchbyTags(seathtag).subscribe((apires: APIData) => {
        this.users = new Array();
        this.tags = new Array();
        for (j = 0; j < apires.data.length; j++) {
          this.tags.push((apires.data)[j]);
          var Tag = document.getElementById(((apires.data)[j])._id) as HTMLImageElement;
        }
      }, (err) => {
        this.NavBarService.triggernotifcations("#EA4335", err.msg);
      })

    }


  }

  //search by tag,iteration over the data and push to an array that later used to show the users/tags
  SearchByTag(seathtag) {
    var i, j;
    this.apiServ.searchbyTags(seathtag).subscribe((apires: APIData) => {
      this.tags = new Array();
      for (j = 0; j < apires.data.length; j++) {
        this.tags.push((apires.data)[j]);
        var Tag = document.getElementById(((apires.data)[j])._id) as HTMLImageElement;
      }
    })
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
  // this method it's called whenever you search for users
  // takes name the id of the user and datain which is the buffer of the image
  // converts the buffer and datatype to a url that can be used to show the img
  getimageuser(elementId, datain) {
    var reader: FileReader = new FileReader();
    reader.readAsDataURL(new Blob([new Buffer(datain.data)], { type: datain.data.contentType }))
    reader.addEventListener("load", function () {
      var profileimg = document.getElementById(elementId) as HTMLImageElement;
      if (profileimg != null) {
        profileimg.src = reader.result;
      }
    }, false);
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

  refresh() {
    if (this.users != null) {
      this.route.params.subscribe(params => {
        this.searchtag = params['searchtag'];
        this.search(this.searchtag);
      });
    }
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
