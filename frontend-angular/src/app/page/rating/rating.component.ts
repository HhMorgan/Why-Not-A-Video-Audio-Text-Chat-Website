import {Component , OnInit} from "@angular/core";
import {APIData , User} from '../../@core/service/models/api.data.structure';
import { APIService  } from "../../@core/service/api.service";


@Component({
  //another conflict i chose the new 
  //  selector: 'app-login',
    selector: 'app-root',
    templateUrl: './template/rating.component.html',
    styleUrls: ['./template/rating.component.scss'],
  })
  
  export class ratingComponent {
numberofsessions=2;
averagerating=3; 
newavgrating=0; 
newnumberofsessions=0;
// another conflict i also chose the new one
// sessionRating=0;
// newrating=0;
// userrole="User";
// //private user= <User>{};
private user= <User>{};
  constructor(private _apiService:APIService){}  
 ngOnInit() {
   /*  this.apiService.getUserData().subscribe((response: APIData)=>{
        console.log(response);
        this.numberofsessions = response.data.numberofsessions;
        this.averagerating=response.data.rating;
        })*/
      }
      

// yet another conflict i also chose the new 1
        // userrating(value:string){
        // this.newrating = +value;
        //   //this.user.rating=this.newavgrating;
        // }
        
        // sessionrating(value:string){
        //   this.sessionRating=+value;      
        // }

        // submitratings(){
        //   alert("Thank you , your rating has been submitted ");
        //   window.location.href="/#/page/signup";
        //   this.newnumberofsessions=this.numberofsessions+1;
        //   this.newavgrating=((this.numberofsessions*this.averagerating)+this.newrating)/(this.newnumberofsessions);
        //   /*this._apiService.update_Rating(this.user).subscribe((apiresponse: APIData)=>{
        //     console.log(apiresponse);
        //     if(apiresponse.msg.includes('Rating updated successfully')){
              
        //     }
        //     else{
        //       //return message (apiresponse.msg)
        //     }});
        //     this._apiService.update_Rating(this.user).subscribe((apiresponse: APIData)=>{
        //       console.log(apiresponse);
        //       if(apiresponse.msg.includes('Rating updated successfully')){
                
        //       }
        //       else{
        //         //return message (apiresponse.msg)
        //       }});*/
        //   }
        rating(value:string){
          alert("Thank you , your rating has been submitted ");
          window.location.href="/#/page/login";
          console.log(value);
          var newrating = +value;
          this.newnumberofsessions=this.numberofsessions+1;
          console.log(this.newnumberofsessions);
          this.newavgrating=((this.numberofsessions*this.averagerating)+newrating)/(this.newnumberofsessions);
          console.log(this.newavgrating); 
          this.user.rating=this.newavgrating;
         this._apiService.update_Rating(this.user).subscribe((apiresponse: APIData)=>{
          console.log(apiresponse);
          if(apiresponse.msg.includes('Rating updated successfully')){
           
          }
          else{
            //return message (apiresponse.msg)
          }});
        }
    
  
    
      }
