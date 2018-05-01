import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ElementRef } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { APIService } from '../../../@core/service/api.service';
import { APIData , User  } from '../../../@core/service/models/api.data.structure'
import { Buffer } from 'buffer';
import { Routes,Router } from '@angular/router';
import { NavBarService } from '../../../@core/service/shared.service';
@Component({
    selector: 'app-navbar',
    templateUrl: './template/navbar.component.html',
    styleUrls: ['./template/navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    public norificationCount = 0;
    public username: string;
    public toggleButton: any;
    public sidebarVisible: boolean;
    public searchtext;
    public searchtag : string;

    constructor( public location: Location , private element : ElementRef , private apiServ:APIService , private router: Router , 
        private navbarservice : NavBarService ) {
        this.sidebarVisible = false;

        navbarservice.change.subscribe(isUserLoggedIn => {
            this.isloggedin();
        });
    }

    ngOnInit() {
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
        this.isloggedin();
       
    }
    
    appendSearchTag(){       
        this.searchtext  =(document.getElementById("textInput") as HTMLInputElement).value;
        this.router.navigate(['page/search',this.searchtext]);
    }
    
    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const html = document.getElementsByTagName('html')[0];
        setTimeout(function(){
            toggleButton.classList.add('toggled');
        }, 500);
        html.classList.add('nav-open');
        this.sidebarVisible = true;
    };
    sidebarClose() {
        const html = document.getElementsByTagName('html')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        html.classList.remove('nav-open');
    };
    sidebarToggle() {
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    };
    isHome() {
        var titlee = this.location.prepareExternalUrl(this.location.path());

        if( titlee === '/home' ) {
            return true;
        }
        else {
            return false;
        }
    }

    getimage(){
        this.apiServ.getimage().subscribe((apires : APIData) =>{
           var navbarimg = document.getElementById("profileimgnavbar") as HTMLImageElement
           var reader = new FileReader();
           if(apires.data.buffer){
            reader.readAsDataURL(new Blob( [new Buffer(apires.data.buffer)] , {type: apires.data.contentType}))
            reader.addEventListener("load", function () {
            navbarimg.src = reader.result;
            }, false);
           }
        });      
    }
    refresh(): void {
        window.location.reload();
    }
    getusername(){
        this.apiServ.getusername().subscribe((apires : APIData) =>{
            this.username = apires.data;
        });      
    }

    isLogin() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if( titlee === 'page/login' ) {
            return true;
        } else {
            return false;
        }
    }

    isDocumentation() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if( titlee === '/documentation' ) {
            return true;
        }
        else {
            return false;
        }
    }

    showNotification() {
        if(this.norificationCount == 0){
            return false;
        }
        return true;
    }

    isAuth(){
        var isAuth = !(localStorage.getItem('token')=="null")
        if (isAuth){
            return true
        } else 
            return false
    }

    private isloggedin(){
        var isAuth = !( APIService.getToken() == null )
        if (isAuth) { // NG IF Will Be Added
            document.getElementById("login").style.display="none";
            document.getElementById("signup").style.display="none";
            document.getElementById("logout").style.display="block";
            document.getElementById("profile").style.display="block";
            document.getElementById("officeHours").style.display="block";
            document.getElementById("userDropDown").style.display="block";
            document.getElementById("userTextField").style.display="block";
            document.getElementById("dropdownBasic1").style.display="block";
            this.getimage();
            this.getusername();
            this.getNotificationCount();
        } else {
            document.getElementById("login").style.display="block";
            document.getElementById("logout").style.display="none";
            document.getElementById("profile").style.display="none";
            document.getElementById("officeHours").style.display="none";
            document.getElementById("userDropDown").style.display="none";
            document.getElementById("userTextField").style.display="none";
            document.getElementById("dropdownBasic1").style.display="none";
        }
    }

    getNotificationCount(){
        this.apiServ.getNotification().subscribe((apiresponse: APIData)=> {
            this.norificationCount = apiresponse.data.length;
        });
    }

    openNotifications(){
        this.router.navigate(['page/notification']); 
    }

    

    logout() {
        localStorage.clear();
        this.navbarservice.setUserLoggedin(false);
    }

    searchbyTags(){
        this.navbarservice.searchBy("Tags");
        var dropdownSearch = (document.getElementById("dropdownBasic2") as HTMLElement).innerHTML="Search By Tags";
      //  this.navbarservice.refreshsearchevent(true);
      
    }
    searchbyUser(){
        this.navbarservice.searchBy("User");
        var dropdownSearch = (document.getElementById("dropdownBasic2") as HTMLElement).innerHTML="Search by User";
       // this.navbarservice.refreshsearchevent(true);
     
    }
    searchbyUserTags(){
        this.navbarservice.searchBy("UserTags");
        var dropdownSearch = (document.getElementById("dropdownBasic2") as HTMLElement).innerHTML="Search by User's Tags";
      //  this.navbarservice.refreshsearchevent(true);
     

    }


/*    TextFieldSearch()
    {
        var userTextField = document.getElementById("userTextField");
        userTextField.addEventListener("keyup",function(addEventListener)
        {
            
        })
    }*/
    
}
