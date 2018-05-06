import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ElementRef } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { APIService } from '../../../@core/service/api.service';
import { APIData, User, Token } from '../../../@core/service/models/api.data.structure'
import { Buffer } from 'buffer';
import { Routes, Router } from '@angular/router';
import { NavBarService, SharedFunctions } from '../../../@core/service/shared.service';
import * as decode from 'jwt-decode';
@Component({
    selector: 'app-navbar',
    templateUrl: './template/navbar.component.html',
    styleUrls: ['./template/navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    
    public username: String;
    public norificationCount = 0;
    
    public toggleButton: any;
    public sidebarVisible: boolean;
    public navbarCollapsed = true;
    
    public searchParams;
    public searchOptions = ['Users' , 'TaggedUsers'];
    public selectedSearchParams = this.searchOptions[0];


    constructor(public location: Location, private element: ElementRef, private apiServ: APIService, private router: Router,
        private navbarservice: NavBarService) {
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

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const html = document.getElementsByTagName('html')[0];
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

        if (titlee === '/home') {
            return true;
        } else {
            return false;
        }
    }

    isLogin() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee === 'page/login') {
            return true;
        } else {
            return false;
        }
    }

    isDocumentation() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee === '/documentation') {
            return true;
        }
        else {
            return false;
        }
    }

    showNotification() {
        if (this.norificationCount == 0) {
            return false;
        }
        return true;
    }

    private isloggedin() {
        console.log(this.apiServ.isAuthenticated())
        if (this.apiServ.isAuthenticated()) {
            document.getElementById("login").style.display = "none";
            document.getElementById("signup").style.display = "none";
            let userToken = <Token> this.apiServ.getToken(true);
            console.log(userToken)
            switch(userToken.role){
                case "admin":
                    document.getElementById("admin").style.display = "block";
                    document.getElementById("officeHours").style.display = "none";
                break;

                case "expert":
                    document.getElementById("admin").style.display = "none";
                    document.getElementById("officeHours").style.display = "block";
                break;

                default :
                    document.getElementById("officeHours").style.display = "none";
                    document.getElementById("admin").style.display = "none";
                break;
            }
            this.username = userToken.username;
            document.getElementById("logout").style.display = "block";
            document.getElementById("profile").style.display = "block";
            document.getElementById("userDropDown").style.display = "block";
            document.getElementById("userTextField").style.display = "block";
            document.getElementById("dropdownBasic1").style.display = "block";
            this.apiServ.getimage().subscribe((apires: APIData) => {
                SharedFunctions.loadImageBy('profileimgnavbar' , apires.data , false);
            });
            this.getNotificationCount();
        } else {
            document.getElementById("admin").style.display = "none";
            document.getElementById("login").style.display = "block";
            document.getElementById("signup").style.display = "block";
            document.getElementById("logout").style.display = "none";
            document.getElementById("profile").style.display = "none";
            document.getElementById("officeHours").style.display = "none";
            document.getElementById("userDropDown").style.display = "none";
            document.getElementById("userTextField").style.display = "none";
            document.getElementById("dropdownBasic1").style.display = "none";
        }
    }

    getNotificationCount() {
        this.apiServ.getNotification().subscribe((apiresponse: APIData) => {
            this.norificationCount = apiresponse.data.length;
        });
    }

    openNotifications() {
        this.router.navigate(['page/notification']);
    }

    isSamePath( page : string ) : boolean {
        console.log(page);
        console.log(this.location.prepareExternalUrl(this.location.path()).includes(page))
        return this.location.prepareExternalUrl(this.location.path()).includes(page);
    }

    logout() {
        localStorage.clear();
        this.isloggedin();
    }

    search(searchtext){
        if(!this.isSamePath('search/'+searchtext)){
            this.navbarCollapsed = !this.navbarCollapsed;
        }
        this.router.navigate(['page/search' , this.selectedSearchParams , searchtext]);
    }

    ChangeSearchOption(searchOption){
        this.selectedSearchParams = searchOption;
    }
}
