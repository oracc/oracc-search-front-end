import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(
    private router: Router,
    private getDataService: GetDataService,
    private breadcrumbsService: HandleBreadcrumbsService
  ) {
    this.breadcrumbsService.setBreadcrumbs(this.router);
  }

  ngOnInit() {
    this.routerLink = 'search-results';
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

  focusSuggestions() {
    if (this.showSuggestions) {
      const suggestions = document.getElementsByClassName('suggestion');
      if (suggestions.length != 0) {
        (suggestions[0] as HTMLElement).focus();
      }
    }
  }
}
