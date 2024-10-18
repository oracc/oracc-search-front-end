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
  public clickedHeaderIndex = 0;
  private translationDataPure: any = [];
  private tableHeadItems: NodeListOf<Element>;
  private tableCells: NodeListOf<Element>;
  private tableHeadFirstItem: Element;
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

  public handleHeaderClick(e, index, hasDropdown = true) {
    console.log(`clicky ${e.target.tagName}`);
    if (e.target.tagName === "INPUT") {
      // Allow the user to use the text input for filtering by period
      return;
    }
    if (window.innerWidth < 600 && hasDropdown) {
      this.tableHeadItems = document.querySelectorAll('.js-table-head-item');
      this.tableHeadFirstItem = document.querySelector(
        '.js-table-head-item:first-of-type'
      );
      this.tableHead = document.querySelector('.js-table-head');
      this.tableHead.classList.toggle('active');
      this.tableCells = document.querySelectorAll('.js-table-cell');
      if (e.target !== this.tableHeadFirstItem) {
        this.tableCells.forEach((cell) => {
          cell.classList.remove('active');
          if (cell.getAttribute('data-id') === index) {
            cell.classList.add('active');
          }
        });
      }
    } else {
      switch (parseInt(e.target.id, 10)) {
        case 0:
          this.sortField = 'gw';
          break;
        case 1:
          this.sortField = 'icount';
          break;
        case 2:
          this.sortField = 'senses_mng';
          break;
        case 3:
          this.sortField = 'lang';
          break;
        case 4:
          this.sortField = null;
          break;
        default:
          this.sortField = 'cf';
      }
      this.isDescending = !this.isDescending;
    }
    this.clickedHeaderIndex = index;
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
