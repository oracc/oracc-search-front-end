import { Component } from '@angular/core';
import { DataService } from '../data-service';
import { TranslateService } from '../translate';


@Component({
  selector: 'display-table',
  templateUrl: './display-table.component.html',
  // TODO Do we need separate styles?
  styleUrls: ['./display-table.component.css'],
  moduleId: module.id,
})

export class DisplayTableComponent {
  title = 'Search results';
  count: number = 10; // how many entries to display
  start: string = ""; // which entry to start from

  constructor(private dataService:DataService, private translateService:TranslateService) {

  }

  entries = [];
  query = ''; // text in the search bar
  ngOnInit() {

  }

  //sorting
  key: string = 'headword'
  reverse: boolean = false;
  sort(key){
    if (this.key != key) {
      this.key = key;
      this.reverse = true;
    } else {
      this.reverse = !this.reverse;
    }
    // Request sorted data
    this.dataService.searchWord(this.query, key, this.reverse).subscribe((entries) => {
        console.log(entries);
        this.entries = entries
    });

  }

  p: number = 1;

  // clicking and hightling rows on mouseover
  clicked(entry) {
    console.log(`clicked from ${entry.cf}`);
    let link = `http://build-oracc.museum.upenn.edu/neo/cbd/${entry.lang}/${entry.id}.html`;
    //window.location.href = link;
    window.open(link);
  }

  searchWord() {
    if (this.query) {
      this.dataService.searchWord(this.query).subscribe((entries) => {
          console.log(entries);
          this.entries = entries;
      });
    } else {
      this.entries = [];
    }
  }

  // language codes and names
  lang_names = {
    // TODO What other languages should we add?
    // See also http://oracc.museum.upenn.edu/doc/help/languages/index.html
    'akk': 'Akkadian',
    'arc': 'Aramaic',
    'elx': 'Elamite',
    'grc': 'Greek',
    'peo': 'Old Persian',
    'sux': 'Sumerian',
    'uga': 'Ugaritic',
    'qpn': 'Proper Name',
    'xhu': 'Hurrian',
  }
  codeToName(lang_code: string): string {
    if (this.lang_names.hasOwnProperty(lang_code)) {
      return this.lang_names[lang_code];
    }
    return lang_code; // if the language has somehow escaped us
  }
}
