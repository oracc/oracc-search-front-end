import { Component, OnInit } from '@angular/core';
import { TranslateService } from '../translate';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
//  styleUrls: ['./help.component.css'],
  moduleId: module.id,
})

export class HomeComponent implements OnInit{
  title = 'home page';

  translations = {
    'welcome.text': {
      'en': 'General text. Some information about Oracc, this search function.',
      'ar': 'General text in Arabic. This will flow from right to left.'
    }
  }

  constructor(private translateService:TranslateService) {

  }

  ngOnInit() {
      this.translateService.addTranslations(this.translations);
  }
}
