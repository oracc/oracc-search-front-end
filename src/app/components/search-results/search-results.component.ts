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
  public isMobile: boolean;
  public isDescending = false;
  public clickedHeaderIndex = 5;
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
    this.isMobile = window.innerWidth < 991 ? true : false;
    this.isMobile && (this.clickedHeaderIndex = 0);
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

  public handleHeaderClick(e, hasDropdown = true) {
    if (window.innerWidth < 991 && hasDropdown) {
      this.tableHeadItems = document.querySelectorAll('.js-table-head-item');
      this.tableHeadFirstItem = document.querySelector(
        '.js-table-head-item:first-of-type'
      );
      this.tableHead = document.querySelector('.js-table-head');
      this.tableCells = document.querySelectorAll('.js-table-cell');
      this.tableHeadItems.forEach((item) => {
        item.classList.toggle('active');
      });
      if (e.target !== this.tableHeadFirstItem) {
        this.tableHead.prepend(e.target);
        this.tableCells.forEach((cell) => {
          cell.classList.remove('active');
          if (cell.getAttribute('data-id') === e.target.id) {
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
    this.clickedHeaderIndex =
      parseInt(e.target.id, 10) === 5 && this.isMobile
        ? this.clickedHeaderIndex
        : parseInt(e.target.id, 10);
  }

  public filterPeriods(e) {
    this.translationData = this.translationDataPure.filter((entry: any) => {
      const hasPeriod = !!entry.periods_p.filter((period: string) => {
        return period.toLowerCase().includes(e.target.value);
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
