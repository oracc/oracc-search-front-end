import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  HostListener,
  OnChanges
} from "@angular/core";
import { GetDataService } from "../../services/get-data/get-data.service";

@Component({
  selector: "app-search-suggestions",
  templateUrl: "./search-suggestions.component.html",
  styleUrls: ["./search-suggestions.component.scss"]
})
export class SearchSuggestionsComponent implements OnInit, OnChanges {
  @Input() searchParam: string;
  @Output() setShowSuggestions = new EventEmitter<boolean>();
  @Output() setSuggestionSearchParam = new EventEmitter<string>();

  public showSuggestions = false;
  public loading = false;
  public searchSuggestions: {};
  public suggestionsCategory = "completions";
  public timer;
  public isMobile: boolean;

  constructor(private getDataService: GetDataService) {}

  ngOnInit() {
    this.isMobile = window.innerWidth < 991 ? true : false;
  }

  ngOnChanges(changes) {
    if (!changes.searchParam || !this.searchParam) return;

    this.getSearchSuggestions(changes.searchParam.currentValue);
  }

  getSearchSuggestions(searchParam: string) {
    searchParam = searchParam.trim();

    if (searchParam.length < 2) {
      this.showSuggestions = false;
      return;
    }

    this.loading = true;
    this.showSuggestions = true;
    this.debounceSearchSuggestions(searchParam);
  }

  debounceSearchSuggestions(searchParam: string) {
    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      this.getDataService
        .getSearchSuggestionsData(searchParam)
        .subscribe((data) => {
          this.searchSuggestions = data;
          this.loading = false;
        });
    }, 500);
  }

  setSuggestionsCategory(event) {
    this.suggestionsCategory = event.target.innerText.toLowerCase();
  }

  setSearchParam(searchParam: string) {
    this.setSuggestionSearchParam.emit(searchParam);
    this.showSuggestions = false;
    this.setShowSuggestionsHandler(false);
  }

  setShowSuggestionsHandler(showSuggestions: boolean) {
    this.setShowSuggestions.emit(showSuggestions);
  }

  @HostListener("window:click", ["$event"])
  hideSuggestionsOnBlur(event) {
    const targetClass = event.target.classList[0];
    const parentNodeClass = event.target.parentNode.className;

    // only hide suggestions if we are not clicking inside the suggestions element
    if (
      targetClass === "search__suggestions" ||
      targetClass === "search__input" ||
      targetClass === "suggestions-category-select" ||
      parentNodeClass === "suggestions-category-select" ||
      parentNodeClass === "search__suggestions"
    ) {
      return;
    }

    this.showSuggestions = false;
  }
}
