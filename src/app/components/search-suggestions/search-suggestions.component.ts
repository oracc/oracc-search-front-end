import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "app-search-suggestions",
  templateUrl: "./search-suggestions.component.html",
  styleUrls: ["./search-suggestions.component.scss"]
})
export class SearchSuggestionsComponent implements OnInit {
  @Input() searchSuggestions;
  @Input() loading;
  @Output() setSuggestionSearchParam: EventEmitter<string> =
    new EventEmitter<string>();

  public suggestionsCategory = "completions";

  constructor() {}

  ngOnInit() {}

  setSuggestionsCategory(event) {
    this.suggestionsCategory = event.target.innerText.toLowerCase();
  }

  setSearch(searchParam: string) {
    this.setSuggestionSearchParam.emit(searchParam);
  }

  setSearchSuggestionOnEnter(event) {
    if (event.code !== "Enter") return;

    const currentActiveSuggestion = document.activeElement.innerHTML.trim();

    this.setSearch(currentActiveSuggestion);
  }
}
