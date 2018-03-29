import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <p>App Root Page works!</p>
  <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  title = 'app';
}
