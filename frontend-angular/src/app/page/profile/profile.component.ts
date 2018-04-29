import { Buffer } from 'buffer';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { APIService } from '../../@core/service/api.service';
import { NavBarService } from '../../@core/service/shared.service';
import { APIData , User , FileData , Tag } from '../../@core/service/models/api.data.structure'

@Component({
  selector: 'app-profile',
  templateUrl: './template/profile.component.html',
  styleUrls: ['./template/profile.component.scss']
})

export class ProfileComponent implements OnInit {
  private user = <User>{};
  private BookmarkedUsers : User[];
  private Tag = <Tag>{};
  private CoverImgOfUser;
  public usernameOfProfile: string;
  private rating: number;
  private ratingwidth: number;
  public currusername: string;
  public description: string;
  public profileInfo = true;
  public profilesettings = false;
  private role: string;
  public fileToUpload: File = null;
  public editable: boolean = true; // intially just for testing


  constructor(private apiServ: APIService, private route: ActivatedRoute,private  NavBarService:NavBarService) { };
  //this method changes the user's current status if it's online to offlne and vice versa

  changeUserStatus() {

    var onlineStatusElem = document.getElementById("onlinestat");
    //var elem = document.querySelector('.toggle-btn');
    if (//inputValue && 
      onlineStatusElem.style.color == "rgb(231, 76, 60)" &&
      !this.user.onlineStatus) {  //if offline 
      // elem.classList.add('active');
      this.user.onlineStatus = true; //change the status to online
      onlineStatusElem.style.color = "#2ecc71"; //change the color of the status circle to green
    }
    else {
      //elem.classList.remove('active');
      this.user.onlineStatus = false;  //change the status to offline
      onlineStatusElem.style.color = "#e74c3c"; //change the color of the status circle to red
    }
    //after that send the user with the new user status value
    //connects to th backend using changeUserStatus() method wchich is implemented in the service file
    this.apiServ.changeUserStatus(this.user).subscribe((apiresponse: APIData) => {

    })
  }

  addtobookmark(){
    var user = <User>{};
    user.username=this.usernameOfProfile;
    this.apiServ.getUserProfile(user).subscribe((apires: APIData) => {
      this.apiServ.addtoToBookmark(apires.data).subscribe((apires: APIData) => {
        this.NavBarService.triggernotifcations("#34A853", apires.msg.toString());
      }, (err) => {
        this.NavBarService.triggernotifcations("#EA4335", err.msg);
      })
    });
  }

  //this method loads the user's current status
  //connects to th backend using loadStatus() method wchich is implemented in the service file
  loadStatus(datain) {
    var onlineStatusElem = document.getElementById("onlinestat");
    // var elem = document.querySelector('.toggle-btn');
    this.apiServ.loadStatus().subscribe((apiresponse: APIData) => {
      if (datain) {
        onlineStatusElem.style.color = "#2ecc71"; //change the color of the status circle to green if online
        // elem.classList.add('active');
      }
      else {
        onlineStatusElem.style.color = "#e74c3c"; //change the color of the status circle to red if offline

        // elem.classList.remove('active');
      }
    })

  }


  //this method gets called everytime the page is reloaded
  
  ngOnInit() {
   
    this.getcurrusername();
    this.route.params.subscribe(params => {  //this method passes the username paramter in URL to the page
      this.user.username = params['username'];
      this.apiServ.getUserProfile(this.user).subscribe((apires: APIData) => { //this method gets all the info of current profile 
        var specialities_ids = apires.data.speciality; //getting the speciality array of the user in terms of Object_id
        var specialities_names: Tag[] = new Array(); //array to hold the names of the specs
        this.BookmarkedUsers= new Array();
        var Tags_ids: String[] = new Array();
        var i, j, l = 0, Tags_names_length;
        var specsElem = document.getElementById("specs"); //specs div
        // specsElem.innerHTML="";  
        for (i = 0; i < specialities_ids.length; i++) { //looping over every object_id and adding it to  to get it's info
          this.Tag._id = specialities_ids[i] + "";
          Tags_ids.push(specialities_ids[i]);

        }
        this.apiServ.getTagbyId(Tags_ids).subscribe((apires: APIData) => {
          for (i = 0; i < apires.data.length; i++) { //looping over every element and adding it to an array to append it later with the string of the element getTagbyId to get it's info
            specialities_names.push(apires.data[i]);
          }

          
          var Tagsdiv = document.getElementById("tagsdiv");
        while (Tagsdiv.firstChild) {
          Tagsdiv.removeChild(Tagsdiv.firstChild);
              }

          for (i = 0; i < specialities_names.length / 4; i++) {
            var TagsContainer = document.createElement("div");
            TagsContainer.setAttribute("id", "TagsSmallContainer" + i);
            for (j = 0; j < 4 && l < specialities_names.length; j++) {
              var Tag = document.createElement("button");
              var DeleteTag = document.createElement("i");  
              DeleteTag.classList.add('fa');
              DeleteTag.classList.add('fa-close');
              DeleteTag.style.display = "none";
  
           if(this.isloggeduser()){
            Tag.appendChild(DeleteTag);
            DeleteTag.addEventListener("mouseover", function () {
              var ParentTag = event.target as HTMLElement;
              var x = ParentTag.firstChild as HTMLElement;
              if (ParentTag != null) {
                ParentTag.style.display = "inline-block";
                // x.style.zIndex="block";
              }
            });

            DeleteTag.addEventListener("mouseout", function () {
              var ParentTag = event.target as HTMLElement;
              var x = ParentTag.firstChild as HTMLElement;
              if (ParentTag != null) {
                ParentTag.style.display = "none";
              }
            });

            DeleteTag.addEventListener("click", () => { 


              var iElementX = event.target as HTMLElement;
              var parentBtn = iElementX.parentNode as HTMLElement
            var Tag  = <Tag>{};
            Tag.name=parentBtn.textContent;
            this.editSpecs(Tag,parentBtn)
            

            });

            var ParentTag = event.target as HTMLElement;
            var x = ParentTag.firstChild as HTMLElement;

            Tag.addEventListener("mouseover", function () {
              var ParentTag = event.target as HTMLElement;
              var x = ParentTag.firstChild as HTMLElement;
              if (x != null) {
                x.style.display = "inline-block";
                // x.style.zIndex="block";
              }
            });
            Tag.addEventListener("mouseout", function () {
              var ParentTag = event.target as HTMLElement;
              var x = ParentTag.firstChild as HTMLElement;
              if (x != null) {
                x.style.display = "none";
              }
            });

          
           }     
            
              var divider = document.createElement("div");
              divider.classList.add("divider");
              var t = document.createTextNode(specialities_names[l].name + "");
              Tag.classList.add("btn");
              // Tag.classList.add("btn-danger");
              Tag.classList.add("btn-round");

              Tag.style.backgroundColor =specialities_names[l].color.name.toString();
            Tag.style.borderColor =specialities_names[l].color.name.toString();
              Tag.classList.add("btn-sm");
              Tag.appendChild(t);
              TagsContainer.appendChild(Tag);
              TagsContainer.appendChild(document.createTextNode(' '));                                         // Append the text to <p>
              l++
              // document.getElementById("tagsdiv").appendChild(para2);           // Append <p> to <div> with id="myDIV"
            }
            document.getElementById("tagsdiv").appendChild(TagsContainer);
            // var br = document.createElement("br"); 
            document.getElementById("tagsdiv").appendChild(document.createTextNode(' '));           // Append <p> to <div> with id="myDIV"
          }
        }, (err) => {
          console.log(err);
        });

        this.usernameOfProfile = apires.data.username; //getting the username of showed profile
        this.description = apires.data.description; //getting the desc. of showed profile
        this.getimageuser(apires.data.img); //this method gets/views the image of the user 
        this.showrating(apires.data.rating) ;//this method gets/views the ratings of the user 
        this.CoverImgOfUser = apires.data.CoverImg;
        this.getCoverImgUser(apires.data.CoverImg);
        this.getBookmarks(apires.data.bookmarks);
        this.role = apires.data.role;
        if (this.role == 'user') {
          this.role = '';
        }
        this.editstatus();
        this.loadStatus(apires.data.onlineStatus); //this method gets/views the status of the user

      })
    });


  }

  getimageBookmarked(name, datain) {
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

  getBookmarks(datain){
    var Users_ids: String[] = new Array();
    this.BookmarkedUsers= new Array();
    Users_ids=datain;
    var i;
    this.apiServ.getUserbyIds(Users_ids).subscribe((apiresponse: APIData)=>{
      for( i=0;i<apiresponse.data.length;i++){
        console.log(apiresponse.data);
        this.BookmarkedUsers.push(apiresponse.data[i]);
        this.getimageBookmarked(apiresponse.data[i].username, apiresponse.data[i].img);
      }
    });
  }

  removeBookmarked(){
    var icon = event.target as HTMLElement
    var parentDiv = icon.parentElement as HTMLElement
    var parentDirowClass = parentDiv.parentElement as HTMLElement
    var childdiv = parentDirowClass.childNodes[3] as HTMLElement
    var firstChildDiv = childdiv.firstElementChild as HTMLElement
    var name = firstChildDiv.firstElementChild as HTMLElement
    var user = <User>{};
    user.username=name.innerText.toLowerCase();
    console.log(user.username);
    this.apiServ.getUserProfile(user).subscribe((apires: APIData) => {
      this.apiServ.removeFromBookmark(apires.data).subscribe((apires: APIData) => {
        this.NavBarService.triggernotifcations("#34A853", apires.msg.toString());
        childdiv.parentElement.remove();
      }, (err) => {
        this.NavBarService.triggernotifcations("#EA4335", err.msg);
      })
    });
  }


   editSpecs(tag,button ){

    this.apiServ.getTagbyName(tag).subscribe((apiresponse: APIData)=>{

      var Tag  = <Tag>{};  
      Tag=apiresponse.data ;
       this.apiServ.editSpeciality(Tag).subscribe((apiresponse: APIData)=>{
        if(apiresponse.msg == "Speciality removed"){
          button.remove();
          this.NavBarService.triggernotifcations("#34A853", apiresponse.msg.toString());
        }
   
      }, (err) => {
        this.NavBarService.triggernotifcations("#EA4335", err.msg);
      }); 
               });

              
      
   

   }
  

  //this method takes the data(ratings) of the user from ngOnIt
  showrating(datain) {
    this.rating=datain;
    var widthofStars = document.getElementById("widthofStars") as HTMLElement
    
    widthofStars.style.width=  'calc(100% * ('+ this.rating +'/ 5))';
   /*  var stars = document.querySelectorAll('[id^=star]');
    var textToWrite;
    var i;
    for (i in stars) {
      if (i < datain) {
        stars[i].classList.add('checked');
      }
    } */
  }

  //this method gets username of the loggedin user
  //connects to th backend using getusername() method wchich is implemented in the service file
  getcurrusername() {
    this.apiServ.getusername().subscribe((apires: APIData) => {
      this.currusername = apires.data;
    });
  }
  //this method checks if the profile that's currently viewed is the same as the loggedin user
  isloggeduser() {

    if (this.usernameOfProfile != this.currusername) {
      return false;
    }
    else {
      return true;
    }
  }

  isExpert() {
    if (this.role == 'expert') {
      return true;
    }
    else {
      return false;
    }
  }

  editstatus() {

    var onlineStatusElem = document.getElementById("onlinestat");
    if (!this.isloggeduser()) {
      onlineStatusElem.setAttribute('style', 'pointer-events:none');
    }
    else {
      onlineStatusElem.setAttribute('style', 'pointer-events:block');
    }

  }
  //this method basically disables the profile page and views the settings page

  handleFileInput(files: FileList) {
    //console.log(files.item(0));
    this.fileToUpload = files.item(0);
    let fy: FileData = { file: files.item(0) };
    this.apiServ.postFile(fy).subscribe(data => {
      // do something, if upload success
      this.getimage();
    }, error => {
      console.log(error);
    });

  }

  handleFileInputCoverImg(files: FileList) {
    //console.log(files.item(0));
    this.fileToUpload = files.item(0);
    let fy: FileData = { file: files.item(0) };

    this.apiServ.postCoverImg(fy).subscribe(data => {
      this.apiServ.getUserProfile(this.user).subscribe((apires: APIData) => {
        this.CoverImgOfUser = apires.data.CoverImg;
        this.getCoverImgUser(this.CoverImgOfUser);
      });
     
    }, error => {
      console.log(error);
    });



  }

  getimage() {
    this.apiServ.getimage().subscribe((apires: APIData) => {
      var profileimg = document.getElementById("profileimg") as HTMLImageElement
      var navbarimg = document.getElementById("profileimgnavbar") as HTMLImageElement
      var reader: FileReader = new FileReader();
      reader.readAsDataURL(new Blob([new Buffer(apires.data.buffer)], { type: apires.data.contentType }))
      reader.addEventListener("load", function () {
        profileimg.src = reader.result;
        navbarimg.src = reader.result;
      }, false);
    }, (err) => {
      console.log(err);
    });
  }

  getimageuser(datain) {
    var profileimg = document.getElementById("profileimg") as HTMLImageElement
    // var navbarimg = document.getElementById("profileimgnavbar") as HTMLImageElement
    var reader: FileReader = new FileReader();
    reader.readAsDataURL(new Blob([new Buffer(datain.data)], { type: datain.data.contentType }))

    reader.addEventListener("load", function () {
      profileimg.src = reader.result;
      // navbarimg.src = reader.result;
    }, false);

  }

  getCoverImgUser(datain) {
    var profileimg = document.getElementById("coverImg") as HTMLImageElement
    // var navbarimg = document.getElementById("profileimgnavbar") as HTMLImageElement
    var reader2: FileReader = new FileReader();
    reader2.readAsDataURL(new Blob([new Buffer(datain.data)], { type: datain.data.contentType }))
    //var holder=;
    reader2.addEventListener("load", function () {
      profileimg.style.backgroundImage = 'url(' + reader2.result + ')';
      // profileimg.src = reader2.result;
    }, false);

  }

  public profilesettingsbtn() {
    this.profileInfo = false;
    this.profilesettings = true;
    // document.getElementById("settings-page").style.display = "block";
  }

  settingsComponentClose($event){
    this.profileInfo = true;
    this.profilesettings = false;
    // document.getElementById("settings-page").style.display = "none";
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
