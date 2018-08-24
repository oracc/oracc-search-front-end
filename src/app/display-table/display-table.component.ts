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
    this.key = key;
    this.reverse = !this.reverse;
  }
  sortedEntries(): any {
    return this.entries.sort((a, b) => {
      let a_val = a[this.key];
      let b_val = b[this.key];
      if (this.reverse) {
        return (a_val < b_val) ? -1 : ((a_val == b_val) ? 0 : 1)
      } else {
        return (a_val > b_val) ? -1 : ((a_val == b_val) ? 0 : 1)
      }
    })
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
    this.dataService.searchWord(this.query).subscribe((entries) => {
        console.log(entries);
        this.entries = entries
    });
  }

  // language codes and names
  lang_names = {
    // TODO What other languages should we add? qpn? xhu? others?
    // See also http://oracc.museum.upenn.edu/doc/help/languages/index.html
    'akk': 'Akkadian',
    'arc': 'Aramaic',
    'elx': 'Elamite',
    'grc': 'Greek',
    'peo': 'Old Persian',
    'sux': 'Sumerian',
    'uga': 'Ugaritic',
  }
  codeToName(lang_code: string): string {
    if (this.lang_names.hasOwnProperty(lang_code)) {
      return this.lang_names[lang_code];
    }
    return lang_code; // if the language has somehow escaped us
  }
}
