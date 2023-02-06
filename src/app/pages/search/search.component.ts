import { Component, OnInit } from '@angular/core';
import { GetDataService } from '../../services/get-data/get-data.service';
import { HandleBreadcrumbsService } from '../../services/handle-breadcrumbs/handle-breadcrumbs.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  private searchInput: Element;
  private searchButton: HTMLElement;
  public placeholderText: string;
  public isMobile: boolean;
  public routerLink: string;
  public searchParam: string;
  public showSuggestions = false;
  public breadcrumbLink = [
    {
      name: 'Search',
      url: '/search'
    }
  ];

  constructor(
    private getDataService: GetDataService,
    private breadcrumbsService: HandleBreadcrumbsService
  ) {
    this.breadcrumbsService.setBreadcrumbs(this.breadcrumbLink);
  }

  ngOnInit() {
    this.routerLink =
      window.innerWidth < 991 ? 'search/search-results' : 'search-results';
    this.isMobile = window.innerWidth < 991 ? true : false;
    this.searchInput = document.querySelector('.js-search-input');
    this.searchButton = document.querySelector('.js-search-btn');
  }

  setSearchParam(searchParam: string) {
    this.getDataService.setSearchParam(searchParam);
  }

  searchOnEnter(event) {
    this.searchButton.click();
    event.target.blur();
  }

  setSuggestionSearchParam(searchParam: string) {
    this.searchParam = searchParam;

    this.searchButton.click();
    this.searchButton.blur();
  }

  setShowSuggestions(showSuggestions: boolean) {
    this.showSuggestions = showSuggestions;
  }
}
