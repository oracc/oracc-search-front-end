import { Component, OnInit } from "@angular/core";
import { GetDataService } from "../../services/get-data/get-data.service";
import { HandleBreadcrumbsService } from "../../services/handle-breadcrumbs/handle-breadcrumbs.service";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"]
})
export class SearchComponent implements OnInit {
  private searchInput: Element;
  private searchButton: HTMLElement;
  public placeholderText: string;
  public isMobile: boolean;
  public routerLink: string;
  public searchParam: string;
  public searchSuggestionsArray;
  public breadcrumbLink = [
    {
      name: "Search",
      url: "/search"
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
      window.innerWidth < 991 ? "search/search-results" : "search-results";
    this.isMobile = window.innerWidth < 991 ? true : false;
    this.searchInput = document.querySelector(".js-search-input");
    this.searchButton = document.querySelector(".js-search-btn");
    this.bindEvents();
  }

  bindEvents() {
    this.searchInput.addEventListener("keydown", (event) => {
      this.searchOnEnter(event);
    });
  }

  setSearchParam(searchParam: string) {
    this.getDataService.setSearchParam(searchParam);
  }

  setSuggestionSearchParam(searchParam: string) {
    this.searchParam = searchParam;
    this.searchSuggestionsArray = null;
  }

  getSearchSuggestions(searchParam) {
    if (searchParam.length > 1) {
      this.getDataService
        .getSearchSuggestionsData(searchParam)
        .subscribe((data) => {
          console.log(data);
          this.searchSuggestionsArray = data;
        });
    }
  }

  searchOnEnter(event) {
    event.stopImmediatePropagation(); // prevents repeated api calls

    if (event.code === "Enter") {
      this.searchButton.click();
      event.target.blur();
    }
  }
}
