import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { GetDataService } from '../../services/get-data/get-data.service';
import { Router, NavigationEnd } from '@angular/router';
import { HandleBreadcrumbsService } from '../../services/handle-breadcrumbs/handle-breadcrumbs.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  public dataRecieved = false;
  public noRecievedData = false;
  public waitForData = false;
  public currentPage = 1;
  public sortField = 'cf';
  public itemsPerPage = 10;
  public results: number;
  public tableHeadings = ['Translation', 'Hits', 'Meanings', 'Lang', 'Period'];
  public translationData = [];
  public isDescending = false;
  // The last clicked header; so where the sort arrow is.
  public sortedColumn = 5;
  // The last clicked header that wasn't the first header, so
  // this one is forced to be visible.
  public forcedVisibleColumn = 0;
  private translationDataPure: any = [];
  private tableCells: NodeListOf<Element>;
  private tableHead: Element;
  private navigationSubscription;

  @Output() public wordClickEvent = new EventEmitter();

  constructor(
    private getDataService: GetDataService,
    private router: Router,
    private breadcrumbsService: HandleBreadcrumbsService
  ) {
    this.breadcrumbsService.setBreadcrumbs(this.router);
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.search();
      }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  public search() {
    this.dataRecieved = false;
    this.waitForData = true;
    this.getDataService.getSearchData().subscribe((data) => {
      // @ts-ignore
      this.translationData = data;
      this.translationDataPure = data;
      this.checkIfDataRecieved(this.translationData);
    });
  }

  private checkIfDataRecieved(data) {
    if (data) {
      this.results = data.length;
      this.dataRecieved = true;
      this.waitForData = false;
      this.noRecievedData = false;
    } else {
      this.dataRecieved = false;
      this.waitForData = false;
      this.noRecievedData = true;
    }
  }

  public setItemsPerPage(e, items) {
    this.itemsPerPage = items;
  }

  public handleDropDown(e, index) {
    e.preventDefault();
    e.stopPropagation();
    this.tableHead = document.querySelector('.js-table-head');
    this.tableHead.classList.add('active');
  }

  public handleHeaderClick(e, index, hasDropdown) {
    if (e.target.tagName === "INPUT") {
      // Allow the user to use the text input for filtering by period
      return;
    }
    // Are we removing the dropdown?
    if (hasDropdown) {
      this.tableHead = document.querySelector('.js-table-head');
      if (this.tableHead.classList.contains('active')) {
        this.tableHead.classList.remove('active')
        this.tableCells = document.querySelectorAll('.js-table-cell');
        this.tableCells.forEach((cell) => {
          cell.classList.remove('active');
          if (cell.getAttribute('data-id') === index) {
            cell.classList.add('active');
          }
        });
      }
    }
    const sortField = ['gw', 'icount', null, 'lang', null, 'cf'][index];
    if (sortField) {
      if (this.sortField === sortField) {
        this.isDescending = !this.isDescending;
      } else {
        this.sortField = sortField;
      }
      this.sortedColumn = index;
    }
    if (hasDropdown) {
      this.forcedVisibleColumn = index;
    }
  }

  public filterPeriods(e) {
    this.translationData = this.translationDataPure.filter((entry: any) => {
      const hasPeriod = !!entry.periods_p.filter((period: string) => {
        return period.toLowerCase().includes(e.target.value.toLowerCase());
      }).length;
      if (hasPeriod) {
        return true;
      } else {
        return false;
      }
    });
    this.results = this.translationData.length;
  }

  public showGlossaryArticle(lang: string, id: string, word: string) {
    const wordClean = word.replace(' ', '-');
    // navigates to glossary article component
    this.router.navigate(['search-results', wordClean], {queryParams: {
      proj: 'neo',
      ga_lang: lang,
      ga_isid: id
    }});
  }
}
