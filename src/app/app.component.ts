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
  supportedLangs: any[];
  public languageName: string;
  currentLang: string;

  constructor(private translateService:TranslateService) {

  }

  entries = []

  ngOnInit() {

      this.supportedLangs = [
        { display: 'English', value: 'en' },
        { display: 'Arabic', value: 'ar'},
        // new languages go here so that there is a button for selecting them
      ];
      this.selectLang('en');
  }

  isCurrentLang(lang: string) {
        // check if the selected lang is current lang
        return lang === this.currentLang;
  }

  selectLang(lang: string) {
      // set current lang;
      this.currentLang = lang; // check it exists first!
      this.translateService.use(lang);
      console.log(`Chosen ${lang}`)
      this.refreshText();
  }

  refreshText() {
      // refresh translation when language change
      // should be handled by pipe
      this.languageName = this.currentLang;
  }

}
