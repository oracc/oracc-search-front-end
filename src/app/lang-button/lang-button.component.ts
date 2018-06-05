import { Component, OnInit } from '@angular/core';
import { TranslateService } from '../translate';

@Component({
  selector: 'lang-button',
  templateUrl: './lang-button.component.html',
  styleUrls: ['./lang-button.component.css']
})
export class LangButtonComponent implements OnInit {

  public languageName: string;
  currentLang: string;
  public supportedLangs: Language[];

  constructor(private translateService: TranslateService) { }

  ngOnInit() {
    this.supportedLangs = this.translateService.getSupportedLanguages();
    this.currentLang = this.translateService.currentLang;
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
