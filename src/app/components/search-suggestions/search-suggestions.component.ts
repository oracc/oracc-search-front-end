import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  HostListener,
  OnChanges
} from '@angular/core';
import { GetDataService } from '../../services/get-data/get-data.service';
import { findInCollection } from 'src/utils/utils';

enum SuggestionsCategories {
  COMPLETIONS = 'completions',
  SUGGESTIONS = 'suggestions'
}

@Component({
  selector: 'app-search-suggestions',
  templateUrl: './search-suggestions.component.html',
  styleUrls: ['./search-suggestions.component.scss']
})
export class SearchSuggestionsComponent implements OnInit, OnChanges {
  @Input() searchParam: string;
  @Output() setShowSuggestions = new EventEmitter<boolean>();
  @Output() setSuggestionSearchParam = new EventEmitter<string>();

  public showSuggestions = false;
  public loading = false;
  public searchSuggestions: {};
  public suggestionsCategory: SuggestionsCategories;
  public timer;
  public isMobile: boolean;

  constructor(private getDataService: GetDataService) {}

  ngOnInit() {
    this.isMobile = window.innerWidth < 600 ? true : false;
    this.suggestionsCategory = SuggestionsCategories.COMPLETIONS;
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
    let newCategory = event.target.innerText.toUpperCase();

    this.suggestionsCategory = SuggestionsCategories[
      newCategory
    ] as SuggestionsCategories;
  }

  setSearchParam(searchParam: string) {
    this.setSuggestionSearchParam.emit(searchParam);
    this.showSuggestions = false;
    this.setShowSuggestionsHandler(false);
  }

  setShowSuggestionsHandler(showSuggestions: boolean) {
    this.setShowSuggestions.emit(showSuggestions);
  }

  @HostListener('window:click', ['$event'])
  hideSuggestionsOnBlur(event) {
    const searchSuggestionsEl = event.target.closest('.search__suggestions');

    // hide suggestions if we click outside the component
    if (searchSuggestionsEl == null) this.showSuggestions = false;
  }

  nextSuggestion() {
    const suggestions = document.getElementsByClassName('suggestion');
    const index = findInCollection(suggestions, e => e == document.activeElement);
    if (index !== null && index + 1 < suggestions.length) {
      (suggestions[index + 1] as HTMLElement).focus();
    }
  }

  prevSuggestion() {
    const suggestions = document.getElementsByClassName('suggestion');
    const index = findInCollection(suggestions, e => e == document.activeElement);
    if (index !== null && index !== 0) {
      (suggestions[index - 1] as HTMLElement).focus();
    }
  }
}
