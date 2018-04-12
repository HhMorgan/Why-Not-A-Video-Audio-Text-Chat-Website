import { Component } from '@angular/core';
//import { MENU_ITEMS } from './pages-menu';

@Component({
  selector: 'app-pages',
  template: `
  <ng2-smart-table [settings]="settings"></ng2-smart-table>
  `,
})
export class PageComponent {
  //menu = MENU_ITEMS;
}
