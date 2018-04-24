import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APIService } from '../../@core/service/api.service';
import { APIData, User,Tags } from '../../@core/service/models/api.data.structure';
import { Routes,Router } from '@angular/router';

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.css']
})
export class SearchUserComponent implements OnInit {

  private searchtag;
  private users:User[];
  private tags:Tags[];


  constructor(private apiServ:APIService,private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {  
    
    console.log('loly');
   
    var i,j;
    
    this.route.params.subscribe(params => {  //this method passes the username paramter in URL to the page
    this.searchtag = params['searchtag'];

      this.apiServ.getMatchingSearch(this.searchtag).subscribe((apires : APIData)=>
      {
        this.users=new Array();
        this.tags=new Array();
      // var UsersData = new Array(apires.data[1]);
        console.log(apires);
        for(i=0;i<apires.data[1].length;i++){
          this.users.push((apires.data[1])[i]);
          this.getimageuser( (apires.data[1])[i].username ,( apires.data[1])[i].img );
        }


        for(j=0;j<apires.data[0].length;j++){
          this.tags.push((apires.data[0])[j]);
          var Tag = document.getElementById(((apires.data[0])[j])._id) as HTMLImageElement;
        } 
      })

    });

  }

  getimageuser(name , datain ){
    var reader : FileReader = new FileReader();
    reader.readAsDataURL(new Blob( [new Buffer(datain.data)] , {type: datain.data.contentType}))
    reader.addEventListener("load", function () {
      var profileimg = document.getElementById(name) as HTMLImageElement;
      profileimg.src = reader.result;
     // navbarimg.src = reader.result;
    }, false);
}
AddTag(){
var Tags = <Tags>{};
console.log(event.target);
var icon =event.target as HTMLElement
var parentDiv = icon.parentElement as HTMLElement
var parentDirowClass =parentDiv.parentElement as HTMLElement
var firstDivOfRows =parentDirowClass.firstElementChild as HTMLElement
var TagBtn =firstDivOfRows.firstElementChild as HTMLElement
console.log(icon);
console.log(parentDiv);
console.log(parentDirowClass);
console.log(firstDivOfRows);
console.log(TagBtn);
Tags.name=TagBtn.textContent;
//sends the tag name through addSpeciality which is later used to search for the tag and add it

  this.apiServ.addSpeciality(Tags.name).subscribe((apiresponse: APIData)=>{
   console.log(Tags.name);
  });
}
  refresh(){
    if(this.users !=null){
   this.ngOnInit();
    }
  }

}