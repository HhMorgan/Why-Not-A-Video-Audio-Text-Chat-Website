import { Component, OnInit } from '@angular/core';
import { APIService } from '../../@core/service/api.service';
import { APIData  , User ,FileData,Tags} from '../../@core/service/models/api.data.structure'
import {Buffer} from 'buffer';
import { ActivatedRoute } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';

@Component({
    selector: 'app-profile',
    templateUrl: './template/profile.component.html',
    styleUrls: ['./template/profile.component.scss']
})

export class ProfileComponent implements OnInit {
    private user =<User>{};
    private Tag =<Tags>{};
    private CoverImgOfUser;
    usernameOfProfile: string;
    currusername: string;
    description:string;
    profileInfo=true;
    profilesettings=false;
    private role:string;
    

    constructor(private apiServ:APIService,private route: ActivatedRoute) { };
    //this method changes the user's current status if it's online to offlne and vice versa
  
    changeUserStatus(){
   
        var onlineStatusElem = document.getElementById("onlinestat");  
      //var elem = document.querySelector('.toggle-btn');
      if(//inputValue && 
      onlineStatusElem.style.color=="rgb(231, 76, 60)" &&
        !this.user.onlineStatus){  //if offline 
       // elem.classList.add('active');
        this.user.onlineStatus=true; //change the status to online
        onlineStatusElem.style.color="#2ecc71"; //change the color of the status circle to green
      }
      else{
        //elem.classList.remove('active');
        this.user.onlineStatus=false;  //change the status to offline
        onlineStatusElem.style.color="#e74c3c"; //change the color of the status circle to red
      }
      //after that send the user with the new user status value
        //connects to th backend using changeUserStatus() method wchich is implemented in the service file
        this.apiServ.changeUserStatus(this.user).subscribe((apiresponse:APIData)=>
        {
      
      })
    }

    //this method loads the user's current status
    //connects to th backend using loadStatus() method wchich is implemented in the service file
    loadStatus(datain)
    {
      var onlineStatusElem = document.getElementById("onlinestat");  
     // var elem = document.querySelector('.toggle-btn');
      this.apiServ.loadStatus().subscribe((apiresponse:APIData)=>
      {
        if(datain)
      {
        onlineStatusElem.style.color="#2ecc71"; //change the color of the status circle to green if online
       // elem.classList.add('active');
      }
      else
      {
        onlineStatusElem.style.color="#e74c3c"; //change the color of the status circle to red if offline
        
       // elem.classList.remove('active');
      }
      })

    } 

    
   //this method gets called everytime the page is reloaded
    ngOnInit() {
      this.getcurrusername();  
       this.route.params.subscribe(params => {  //this method passes the username paramter in URL to the page
        this.user.username = params['username'];
        this.apiServ.getUserProfile(this.user).subscribe((apires : APIData) =>{ //this method gets all the info of current profile 
          var specialities_ids=apires.data.speciality; //getting the speciality array of the user in terms of Object_id
          var specialities_names: Tags[]= new Array(); //array to hold the names of the specs
          var Tags_ids: String[]= new Array();
          var i,j,l=0,Tags_names_length;
          var specsElem = document.getElementById("specs"); //specs div
         // specsElem.innerHTML="";  
          for( i=0;i<specialities_ids.length;i++ ){ //looping over every object_id and adding it to  to get it's info
            this.Tag._id=specialities_ids[i]+"";
            Tags_ids.push(specialities_ids[i]);  
           
          }
          this.apiServ.getTagbyId(Tags_ids).subscribe((apires : APIData) =>{
            for( i=0;i<apires.data.length;i++ ){ //looping over every element and adding it to an array to append it later with the string of the element getTagbyId to get it's info
            specialities_names.push(apires.data[i]);  
          }
          
          Tags_names_length=specialities_names.length;
        if(specialities_names.length >=4){
          for(i=0;i<specialities_names.length/4;i++ ){
           // Tags_names_length=Tags_names_length-5;
            var TagsContainer = document.createElement("div");
            TagsContainer.setAttribute("id", "TagsSmallContainer"+i);
            for(j=0;j<4 && l<specialities_names.length  ;j++ ){
              var Tag = document.createElement("button"); 
            //  <i class=" "></i>
              var DeleteTag=document.createElement("i")  ;
              Tag.appendChild(DeleteTag);
            //  DeleteTag.classList.add("testy");
           // DeleteTag.classList.add("testy"); 
              DeleteTag.classList.add('fa');
              DeleteTag.classList.add('fa-close');
              var f;
              //f=false;
              DeleteTag.style.display="none";
              var ParentTag = event.target as HTMLElement;
              var x= ParentTag.firstChild as HTMLElement;

              Tag.addEventListener("mouseover", function(){
                var ParentTag = event.target as HTMLElement;
              var x= ParentTag.firstChild as HTMLElement;
              if(x!=null){
                 x.style.display="inline-block";
                // x.style.zIndex="block";
              }
            });

            Tag.addEventListener("mouseout", function(){
              var ParentTag = event.target as HTMLElement;
           var x=   ParentTag.firstChild as HTMLElement;
           if(x!=null){
              x.style.display="none";
           }
         });

         /////

         DeleteTag.addEventListener("mouseover", function(){
          var ParentTag = event.target as HTMLElement;
        var x= ParentTag.firstChild as HTMLElement;
        if(ParentTag!=null){
          ParentTag.style.display="inline-block";
          // x.style.zIndex="block";
        }
      });

      DeleteTag.addEventListener("mouseout", function(){
        var ParentTag = event.target as HTMLElement;
     var x=   ParentTag.firstChild as HTMLElement;
     if(ParentTag!=null){
      ParentTag.style.display="none";
     }
   });
              DeleteTag.addEventListener("click", function(){
                var iElementX = event.target as HTMLElement;
                var parentBtn= iElementX.parentNode as HTMLElement
                console.log(iElementX.parentNode);
                console.log(parentBtn.textContent);
            });
            
            
              var divider = document.createElement("div");
                divider.classList.add("divider");
              var t = document.createTextNode( specialities_names[l].name+"");
              Tag.classList.add("btn");
             // Tag.classList.add("btn-danger");
              Tag.classList.add("btn-round");
             
              Tag.style.backgroundColor =specialities_names[l].color.toString();
              Tag.style.borderColor =specialities_names[l].color.toString();
              Tag.classList.add("btn-sm");
                Tag.appendChild(t); 
                TagsContainer.appendChild(Tag); 
                TagsContainer.appendChild( document.createTextNode(' ') );                                         // Append the text to <p>
              l++
             // document.getElementById("tagsdiv").appendChild(para2);           // Append <p> to <div> with id="myDIV"
            }
            document.getElementById("tagsdiv").appendChild(TagsContainer);
           // var br = document.createElement("br"); 
            document.getElementById("tagsdiv").appendChild( document.createTextNode(' '));           // Append <p> to <div> with id="myDIV"
            }
          }
          
           else{
            var TagsContainer = document.createElement("div");
            
            for(i=0;i<specialities_names.length;i++ ){ 
              var Tag = document.createElement("button");                      // Create a <p> element
            var t = document.createTextNode( specialities_names[i].name+"");
            Tag.classList.add("btn");
            Tag.classList.add("btn-round");
            Tag.classList.add("btn-sm");
              Tag.appendChild(t);
              TagsContainer.appendChild(Tag); 
            
            }
            document.getElementById("tagsdiv").appendChild(TagsContainer); 
            TagsContainer.appendChild( document.createTextNode(' ') );      
          } 
         

        
          //specsElem.innerHTML += specialities_names.toString();

         //pecsElem.innerHTML += specialities_names.toString();
          },(err) =>{
            console.log(err);
          }); 
          
          this.usernameOfProfile = apires.data.username; //getting the username of showed profile
          this.description=apires.data.description; //getting the desc. of showed profile
          this.getimageuser(apires.data.img); //this method gets/views the image of the user 
          this.showrating(apires.data.rating); //this method gets/views the ratings of the user 
          console.log(apires.data);
          this.CoverImgOfUser=apires.data.CoverImg;
          this.getCoverImgUser(apires.data.CoverImg);
          this.role=apires.data.role;
          if(this.role=='user'){
            this.role='';
          }
          this.editstatus();
          this.loadStatus(apires.data.onlineStatus); //this method gets/views the status of the user
        
 })
     });

       
    }

   //this method takes the data(ratings) of the user from ngOnIt
    showrating(datain){
      var stars = document.querySelectorAll('[id^=star]');
      var textToWrite;
      var i;
      for(i in stars ){
        if (i<datain){
          stars[i].classList.add('checked');
        }
      }
     }
  
     //this method gets username of the loggedin user
     //connects to th backend using getusername() method wchich is implemented in the service file
    getcurrusername(){
      this.apiServ.getusername().subscribe((apires : APIData) =>{
               this.currusername = apires.data;             
      });      
  }
  //this method checks if the profile that's currently viewed is the same as the loggedin user
    isloggeduser(){
     
        if(this.usernameOfProfile!=this.currusername){
             return false;
        }
        else{
        return true;       
        }       
    }

    isExpert(){
      if(this.role=='expert'){
         return true;
      }
      else{
         return false;
      }
    }

     editstatus(){
       
      var onlineStatusElem = document.getElementById("onlinestat");  
      if(!this.isloggeduser()){
       onlineStatusElem.setAttribute('style','pointer-events:none');
      }
      else{
        onlineStatusElem.setAttribute('style','pointer-events:block');
      }
      console.log(this.usernameOfProfile+" ahh");
      console.log(this.currusername+" ahhwn");
      console.log(this.isloggeduser()+"ttt");       
  
  } 

   //this method basically disables the settings page and views the profile page
     profileinfo(){
     
      this.profileInfo=true;
      this.profilesettings=false;
    }
    //this method basically disables the profile page and views the settings page
    public profilesettingsbtn(){
      this.profilesettings=true;
      this.profileInfo=false;
    
    }
    ProfileComponent=this;
    fileToUpload: File = null;
    editable: boolean = true; // intially just for testing

  handleFileInput(files: FileList) {
    //console.log(files.item(0));
    this.fileToUpload = files.item(0);
    let fy:FileData ={file:files.item(0)};
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
    let fy:FileData ={file:files.item(0)};
    
    this.apiServ.postCoverImg(fy).subscribe(data => {
      this.apiServ.getUserProfile(this.user).subscribe((apires : APIData) =>{
        this.CoverImgOfUser=apires.data.CoverImg;
      });
      this.getCoverImgUser(this.CoverImgOfUser);
      }, error => {
        console.log(error);
      });

    
      
  }
  
  getimage(){
    this.apiServ.getimage().subscribe((apires : APIData) =>{
      var profileimg = document.getElementById("profileimg") as HTMLImageElement
      var navbarimg = document.getElementById("profileimgnavbar") as HTMLImageElement
      var reader : FileReader = new FileReader();
      reader.readAsDataURL(new Blob( [new Buffer(apires.data.buffer)] , {type: apires.data.contentType}))
      reader.addEventListener("load", function () {
        profileimg.src = reader.result;
        navbarimg.src = reader.result;
      }, false);
      },(err) =>{
      console.log(err);
    });
  }

  getimageuser(datain){
      var profileimg = document.getElementById("profileimg") as HTMLImageElement
     // var navbarimg = document.getElementById("profileimgnavbar") as HTMLImageElement
      var reader : FileReader = new FileReader();
      reader.readAsDataURL(new Blob( [new Buffer(datain.data)] , {type: datain.data.contentType}))
      console.log(reader.result);
      reader.addEventListener("load", function () {
        profileimg.src = reader.result;
       // navbarimg.src = reader.result;
      }, false);
      
  }

  getCoverImgUser(datain){
    console.log(datain);
    var profileimg = document.getElementById("coverImg") as HTMLImageElement
   // var navbarimg = document.getElementById("profileimgnavbar") as HTMLImageElement
    var reader2 : FileReader = new FileReader();
    reader2.readAsDataURL(new Blob( [new Buffer(datain.data)] , {type: datain.data.contentType}))
    console.log((reader2.result));
    //var holder=;
    reader2.addEventListener("load", function () {
      profileimg.style.backgroundImage = 'url('+reader2.result+')';
     // profileimg.src = reader2.result;
    }, false);
    
}

}
