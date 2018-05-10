import 'rxjs/add/observable/interval';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ElementRef } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { APIService } from '../../../@core/service/api.service';
import { APIData, User, Token } from '../../../@core/service/models/api.data.structure'
import { Buffer } from 'buffer';
import { Routes, Router } from '@angular/router';
import { SharedService, SharedFunctions } from '../../../@core/service/shared.service';
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
    public searchOptions = ['Users', 'TaggedUsers'];
    public selectedSearchParams = this.searchOptions[0];


    constructor(public location: Location, private element: ElementRef, private apiServ: APIService, private router: Router,
        private sharedService: SharedService) {
        this.sidebarVisible = false;
        
        sharedService.change.subscribe(isUserLoggedIn => {
            this.isloggedin();
        });
        
        sharedService.updateNotification.subscribe(unreadNotificationCount =>{
            this.norificationCount = unreadNotificationCount;
        })

        this.apiServ.getUnreadNotifications().subscribe((apiresponse: APIData) => {
            this.norificationCount = apiresponse.data;
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

    isExpert(){
        let userToken = <Token>this.apiServ.getToken(true);
        if(userToken.role=='expert'){
            return true;
        }
        return false;
    }

    isAdmin(){
        let userToken = <Token>this.apiServ.getToken(true);
        if(userToken.role=='admin'){
            return true;
        }
        return false;
    }

    isLogged(){
        if (this.apiServ.isAuthenticated()) {
            return true;
        }
        return false;
    }

    private isloggedin() {
        if (this.apiServ.isAuthenticated()) {
             let userToken = <Token>this.apiServ.getToken(true);
             this.username = userToken.username;
             this.apiServ.getimage().subscribe((apires: APIData) => {
                 SharedFunctions.loadImageBy('profileimgnavbar', apires.data, false);
             });
             this.getNotificationCount();
        } 
    }

    getNotificationCount() {
        Observable.interval( 2 * 60 * 1000 ).subscribe(z => {
            this.apiServ.getUnreadNotifications().subscribe((apiresponse: APIData) => {
                this.norificationCount = apiresponse.data;
            });
        });
    }

    openNotifications() {
        this.router.navigate(['page/notification']);
    }

    isSamePath(page: string): boolean {
        return this.location.prepareExternalUrl(this.location.path()).includes(page);
    }

    logout() {
        localStorage.clear();
        this.isloggedin();
    }

    search(searchtext) {
        if (!this.isSamePath('search/' + searchtext)) {
            this.navbarCollapsed = !this.navbarCollapsed;
        }
        this.router.navigate(['page/search', this.selectedSearchParams, searchtext]);
    }

    ChangeSearchOption(searchOption) {
        this.selectedSearchParams = searchOption;
    }
}
