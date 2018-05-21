import { Component, OnInit } from '@angular/core';
import { TranslateService } from '../translate';

@Component({
  selector: 'help',
  templateUrl: './help.component.html',
//  styleUrls: ['./help.component.css'],
  moduleId: module.id,
})

export class HelpComponent implements OnInit {
  title = 'help page';

  translations = {
    'help.text': {
      'en': 'This is some help content',
      'ar': 'هذه بعض المعلومات.'
    }
  }

  constructor(private translateService:TranslateService) {

  }

  ngOnInit() {
      this.translateService.addTranslations(this.translations);
  }

}
