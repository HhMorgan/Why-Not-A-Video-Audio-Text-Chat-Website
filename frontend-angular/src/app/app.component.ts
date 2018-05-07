import { Component, OnInit, Inject, Renderer, ElementRef, ViewChild, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import { DOCUMENT } from '@angular/platform-browser';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { NavbarComponent } from './page/shared/navbar/navbar.component';
import { AppRoutingModule } from './app.routing';

@Component({
    selector: 'app-root',
    template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
    <app-footer *ngIf="removeFooter()"></app-footer>
    `,
})
export class AppComponent {
    title = 'app';
    key;
    keyArray = [];
    keyArrayAnswer = ['w', 'w', 's', 's', 'a', 'd', 'a', 'd', 'Enter'];
    private _router: Subscription;
    @ViewChild(NavbarComponent) navbar: NavbarComponent;

    constructor(private renderer: Renderer, private router: Router, @Inject(DOCUMENT, ) private document: any, private element: ElementRef, public location: Location) { }

    ngOnInit() {
        console.log(document.location.href);
        var navbar: HTMLElement = this.element.nativeElement.children[0].children[0];
        this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
            if (window.outerWidth > 991) {
                window.document.children[0].scrollTop = 0;
            } else {
                window.document.activeElement.scrollTop = 0;
            }
            if (this.removeHeader())
                this.navbar.sidebarClose();
        });
        this.renderer.listenGlobal('window', 'scroll', (event) => {
            const number = window.scrollY;
            if (number > 150 || window.pageYOffset > 150) {
                // add logic
                if (this.removeHeader())
                    navbar.classList.remove('navbar-transparent');
            } else {
                // remove logic
                if (this.removeHeader())
                    navbar.classList.add('navbar-transparent');
            }
        });
        var ua = window.navigator.userAgent;
        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            var version = parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }
        if (version) {
            var body = document.getElementsByTagName('body')[0];
            if (this.removeHeader())
                body.classList.add('ie-background');

        }

    }
    removeHeader() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        titlee = titlee.slice(7);
        if (titlee === 'videotest') {
            return false;
        }
        else {
            return true;
        }
    }
    removeFooter() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        titlee = titlee.slice(7).split("/", 1)[0];
        if (titlee === 'signup' || titlee === 'nucleoicons' || titlee === 'dashboard' || titlee === 'video' || this.title === 'videotest'
            || titlee === 'chat' || titlee === 'login' || titlee === 'about' || titlee === 'search' || titlee == 'profile') {
            return false;
        }
        else {
            return true;
        }
    }
    @HostListener('document:keypress', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        titlee = titlee.slice(7).split("/", 1)[0];
        if (!(titlee === 'signup' || titlee == 'login' || titlee === 'session')) {
            this.key = event.key;
            this.keyArray.push(event.key);
            if (this.keyArray.length == 9) {
                var flag = true;
                for (let i = 0; i < 9; i++) {
                    if (this.keyArray[i] != this.keyArrayAnswer[i]) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    this.router.navigate(['page/about']);
                } else {
                    this.keyArray.splice(0, 1);
                }
            }
        }
    }
}
