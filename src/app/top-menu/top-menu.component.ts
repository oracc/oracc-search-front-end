import { Component } from '@angular/core';


@Component({
  selector: 'top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css', '../app.component.css'],
  moduleId: module.id,
})

export class TopMenuComponent {
  title = 'menu';
}
