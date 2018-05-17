import { Component } from '@angular/core';
import { DataService } from './data.service';
import { TranslateService } from '../translate';


@Component({
  selector: 'search-table',
  templateUrl: './search-table.component.html',
  // TODO Do we need separate styles?
//  styleUrls: ['./search-table.component.css'],
  moduleId: module.id,
})

export class SearchTableComponent {
  title = 'Search results';

  constructor(private dataService:DataService, private translateService:TranslateService) {

  }

  entries = []

  ngOnInit() {

      this.dataService.getEntries().subscribe((entries) => {

          console.log(entries);
          this.entries = entries
      });

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
      if this.reverse {
        return (a_val < b_val) ? -1 : ((a_val == b_val) ? 0 : 1)
      } else {
        return (a_val > b_val) ? -1 : ((a_val == b_val) ? 0 : 1)
      }
    })
  }
  p: number = 1;
}
