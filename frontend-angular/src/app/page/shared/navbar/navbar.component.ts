import { Component, OnInit, ElementRef } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { APIService } from '../../../@core/service/api.service';
import { APIData , User  } from '../../../@core/service/models/api.data.structure'
import { Buffer } from 'buffer';
import { Routes,Router } from '@angular/router';

@Component({
    selector: 'app-navbar',
    templateUrl: './template/navbar.component.html',
    styleUrls: ['./template/navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    private toggleButton: any;
    private sidebarVisible: boolean;

    constructor(public location: Location, private element : ElementRef,private apiServ:APIService,private router: Router) {
        this.sidebarVisible = false;
    }

    ngOnInit() {
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
        this.isloggedin();
       
        }
    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const html = document.getElementsByTagName('html')[0];
        // console.log(html);
        // console.log(toggleButton, 'toggle');

        setTimeout(function(){
            toggleButton.classList.add('toggled');
        }, 500);
        html.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const html = document.getElementsByTagName('html')[0];
        // console.log(html);
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        html.classList.remove('nav-open');
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
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
           reader.readAsDataURL(new Blob( [new Buffer(apires.data.buffer)] , {type: apires.data.contentType}))
           reader.addEventListener("load", function () {
             navbarimg.src = reader.result;
           }, false);
        });      
    }

    isLogin() {
        var titlee = this.location.prepareExternalUrl(this.location.path());

        if( titlee === 'page/login' ) {
            return true;
        }
        else {
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
    isloggedin(){
        var isAuth = !(localStorage.getItem('token')==null)
        console.log(localStorage.getItem('token')==null);
        if (isAuth){
            
          
     document.getElementById("login").style.display="none";
     document.getElementById("logout").style.display="block";
        document.getElementById("signup").style.display="none";
        this.getimage();
      
        }
        else{
            document.getElementById("login").style.display="block";
            document.getElementById("logout").style.display="none";
            document.getElementById("dropdownBasic1").style.display="none";
            document.getElementById("profile").style.display="none";
        }
     
    }
    logout(){
       
            localStorage.clear();
            console.log(localStorage.getItem('token'));
          location.reload();
    }

    isAuth(){
        var isAuth = !(localStorage.getItem('token')=="null")
        if (isAuth){
            return true
        }
        else return false

    }

    
}
