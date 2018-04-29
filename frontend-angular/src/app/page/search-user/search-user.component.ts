import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
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
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.css'],
})
export class SearchUserComponent implements OnInit {
  private users: User[];
  private tags: Tag[];
  public alerts: Array<IAlert> = [];
  closeResult: string;
  private searchBy: string;
  // paged items
 pagedItems: any[];
   p: number = 1;
   p2: number = 1;

   @Input() showUsers:boolean ;
   @Input() showCover:boolean  ;
   @Input() searchtag:string ;
   @Input() showTags:boolean ;


  constructor(private apiServ: APIService, private route: ActivatedRoute, private router: Router, private modalService: NgbModal, private  NavBarService:NavBarService) {
  }


  ngOnInit() {
    
    this.searchByValue();
    this.NavBarService.refreshsearch.subscribe((m:any) => {
      console.log(m);
      this.ngOnInit();       
  })
   if (this.searchBy===undefined)
   this.searchBy="UserTags";
    console.log(this.showCover);
    if(this.showUsers != false && this.showCover != false && this.showTags != true ){
      this.showUsers=true;
      this.showCover=true;
      this.showTags=false;
    }
   
   
   
    this.route.params.subscribe(params => {  //this method passes the username paramter in URL to the page
   
      if(params['searchtag']==null){
        this.NavBarService.searchevent.subscribe((m:any) => {
          //   console.log("lolololo");
           //console.log(m);
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

  refreshsearch(){
    this.NavBarService.refreshsearch.subscribe((m:any) => {
         this.ngOnInit();       
     })
  }

  searchByValue(){
    this.NavBarService.searcheventBy.subscribe((m:any) => {
      console.log(m);
      var searchBy="";
      this.searchBy=m;

    })
}

  addtobookmark(){
    var icon = event.target as HTMLElement
    var parentDiv = icon.parentElement as HTMLElement
    var parentDirowClass = parentDiv.parentElement as HTMLElement
    var childdiv = parentDirowClass.childNodes[3] as HTMLElement
    var firstChildDiv = childdiv.firstElementChild as HTMLElement
    var name = firstChildDiv.firstElementChild as HTMLElement
    var user = <User>{};
    user.username=name.innerText.toLowerCase();
    this.apiServ.getUserProfile(user).subscribe((apires: APIData) => {
      this.apiServ.addtoToBookmark(apires.data).subscribe((apires: APIData) => {
        this.NavBarService.triggernotifcations("#34A853", apires.msg.toString());
      }, (err) => {
        this.NavBarService.triggernotifcations("#EA4335", err.msg);
      })
    });
  }

  search(seathtag){
    var i, j;
    console.log(this.searchBy);
    if( this.searchBy=="UserTags"){
      this.apiServ.searchUserbyTags(seathtag).subscribe((apires: APIData) => {
        this.users = new Array();
        this.tags = new Array();
        // var UsersData = new Array(apires.data[1]);
        console.log(apires);

        for (i = 0; i < apires.data.length; i++) {
          this.users.push((apires.data)[i]);
          this.getimageuser((apires.data)[i].username, (apires.data)[i].img);
        }
      }, (err) => {
        this.NavBarService.triggernotifcations("#EA4335", err.msg);
      })

    }

    else if( this.searchBy=="User"){
      this.apiServ.searchbyUser(seathtag).subscribe((apires: APIData) => {
        this.users = new Array();
        this.tags = new Array();
        // var UsersData = new Array(apires.data[1]);
        console.log(apires);
        for (i = 0; i < apires.data.length; i++) {
          this.users.push((apires.data)[i]);
          this.getimageuser((apires.data)[i].username, (apires.data)[i].img);
        }
      }, (err) => {
        this.NavBarService.triggernotifcations("#EA4335", err.msg);
      })

    }

    else if( this.searchBy=="Tags"){
      this.apiServ.searchbyTags(seathtag).subscribe((apires: APIData) => {
        this.users = new Array();
        this.tags = new Array();
        // var UsersData = new Array(apires.data[1]);
        console.log(apires);
        for (j = 0; j < apires.data.length; j++) {
          this.tags.push((apires.data)[j]);
          var Tag = document.getElementById(((apires.data)[j])._id) as HTMLImageElement;
        }
      }, (err) => {
        this.NavBarService.triggernotifcations("#EA4335", err.msg);
      })

    }
  

  }

  SearchByTag(seathtag){
    var i, j;
    this.apiServ.searchbyTags(seathtag).subscribe((apires: APIData) => {
      this.tags = new Array();
      for (j = 0; j < apires.data.length; j++) {
        this.tags.push((apires.data)[j]);
        var Tag = document.getElementById(((apires.data)[j])._id) as HTMLImageElement;
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
      this.route.params.subscribe(params => {
      this.searchtag = params['searchtag'];
      this.search( this.searchtag);
      });
    }

  }



  RequestTag() {
  var Rtag =<Tag>{};
  Rtag.name = (document.getElementById("RequestingTag") as HTMLInputElement).value; 
  Rtag.status = 'Pending';
  Rtag.blocked = false;  
 
 
  this.apiServ.AddTag(Rtag).subscribe((apiresponse: APIData)=>{
    console.log(apiresponse.msg);
    console.log(Rtag);
    this.NavBarService.triggernotifcations("#34A853","Your request was sent sucessfully");
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