import { Component } from '@angular/core';
import { TranslateService } from './translate';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  moduleId: module.id,
})

export class AppComponent {
  title = 'Main component';

  constructor(public translateService: TranslateService) {

  }

}
