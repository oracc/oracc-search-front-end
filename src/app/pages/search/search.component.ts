import { Component, OnInit, HostListener } from "@angular/core";
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
  public searchSuggestions: {};
  public showSuggestions = false;
  public loading = false;
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

  getSearchSuggestions(event, searchParam: string) {
    // detect arrow key press
    if ((event.keyCode > 36 && event.keyCode < 41) || !searchParam) return;

    if (searchParam.length < 2 || event.code === "Escape") {
      this.showSuggestions = false;
      return;
    }

    this.loading = true;
    this.showSuggestions = true;

    // todo: only call this if letters are entered (not other keys like esc)
    this.getDataService
      .getSearchSuggestionsData(searchParam)
      .subscribe((data) => {
        this.searchSuggestions = data;
        this.loading = false;
      });
  }

  setSuggestionSearchParam(searchParam: string) {
    this.searchParam = searchParam;
    this.showSuggestions = false;

    // will carry out search on enter
    this.searchButton.focus();
  }

  @HostListener("window:click", ["$event"])
  hideSuggestionsOnBlur(event) {
    const targetClass = event.target.classList[0];
    const parentNodeClass = event.target.parentNode.className;

    // only hide suggestions if we are not clicking inside the suggestions element
    if (
      targetClass === "suggestion" ||
      targetClass === "search__input" ||
      parentNodeClass === "suggestions-category-select"
    ) {
      return;
    }

    this.showSuggestions = false;
  }

  searchOnEnter(event) {
    event.stopImmediatePropagation(); // prevents repeated api calls

    if (event.code === "Enter") {
      this.searchButton.click();
      event.target.blur();
    }
  }
}
