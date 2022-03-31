import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  HostListener
} from "@angular/core";

@Component({
  selector: "app-search-suggestions",
  templateUrl: "./search-suggestions.component.html",
  styleUrls: ["./search-suggestions.component.scss"]
})
export class SearchSuggestionsComponent implements OnInit {
  @Input() searchSuggestions: {};
  @Input() loading: Boolean;
  @Output() setShowSuggestions = new EventEmitter<boolean>();
  @Output() setSuggestionSearchParam = new EventEmitter<string>();

  public suggestionsCategory = "completions";
  public isMobile: boolean;

  constructor() {}

  ngOnInit() {
    this.isMobile = window.innerWidth < 991 ? true : false;
  }

  setSuggestionsCategory(event) {
    this.suggestionsCategory = event.target.innerText.toLowerCase();
  }

  setSearchParam(searchParam: string) {
    this.setSuggestionSearchParam.emit(searchParam);
  }

  setShowSuggestionsHandler(showSuggestions: boolean) {
    this.setShowSuggestions.emit(showSuggestions);
  }

  @HostListener("window:click", ["$event"])
  hideSuggestionsOnBlur(event) {
    const targetClass = event.target.classList[0];
    const parentNodeClass = event.target.parentNode.className;

    console.log(targetClass, parentNodeClass);

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

    this.setShowSuggestionsHandler(false);
  }
}
