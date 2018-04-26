import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APIService } from '../@core/service/api.service';
import { APIData, User } from '../@core/service/models/api.data.structure';
import { Routes,Router } from '@angular/router';

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.css']
})
export class SearchUserComponent implements OnInit {

  private searchtag;
  private users:User[];


  constructor(private apiServ:APIService,private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {  
    
    console.log('loly');
   
    var i;
    
    this.route.params.subscribe(params => {  //this method passes the username paramter in URL to the page
    this.searchtag = params['searchtag'];

      this.apiServ.getMatchingUsers(this.searchtag).subscribe((apires : APIData)=>{
        this.users=new Array();
        console.log(apires);
        for(i=0;i<apires.data.length;i++){
          this.users.push(apires.data[i]);
          this.getimageuser( apires.data[i].username , apires.data[i].img );
        }
      })

    });

  }

  getimageuser(name , datain ){
   
    // var profileimg = document.getElementById("profileimg") as HTMLImageElement;
    console.log('--------------------------------------')
    // console.log(profileimg);
    console.log('--------------------------------------')

    
   
   // var navbarimg = document.getElementById("profileimgnavbar") as HTMLImageElement
    var reader : FileReader = new FileReader();
    reader.readAsDataURL(new Blob( [new Buffer(datain.data)] , {type: datain.data.contentType}))
    reader.addEventListener("load", function () {
      var profileimg = document.getElementById(name) as HTMLImageElement;
      profileimg.src = reader.result;
     // navbarimg.src = reader.result;
    }, false);
}
  

}
