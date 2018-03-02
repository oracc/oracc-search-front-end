import { Component } from '@angular/core';
import { DataService } from './data.service';
import { TranslateService } from './translate';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  moduleId: module.id,
})

export class AppComponent {
  title = 'Search results';
  supportedLangs: any[];
  public languageName: string;
  currentLang: string;

  constructor(private dataService:DataService, private translateService:TranslateService) {

  }

  entries = []

  ngOnInit() {

      this.dataService.getEntries().subscribe((entries) => {

          console.log(entries);
          this.entries = entries
      });

      this.supportedLangs = [
        { display: 'English', value: 'en' },
        { display: 'Arabic', value: 'ar'}
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

  //sorting
  key: string = 'headword'
  reverse: boolean = false;
  sort(key){
    this.key = key;
    this.reverse = !this.reverse;
  }
  p: number = 1;
}
