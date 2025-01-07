import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GetDataService {
  private searchParam: string;

  private baseUrl = environment.apiUrl;
  private searchURL = `${this.baseUrl}/search/`;
  private glossaryArticleURL = `${environment.glossaryArticleURL}/neo/`;
  private searchSuggestionsUrl = `${this.baseUrl}/suggest_all/`;
  private oraccBaseUrl = `${environment.glossaryArticleURL}`;

  constructor(private http: HttpClient) {}

  public getSearchData() {
    return this.http.get(this.searchURL + this.searchParam);
  }

  public getSearchSuggestionsData(partialSearchTerm: string) {
    return this.http.get(this.searchSuggestionsUrl + partialSearchTerm);
  }

  public getGlossaryArticleData(lang: string, isid: string) {
    return this.http.get(`${this.glossaryArticleURL}${lang}/${isid}`, {
      responseType: 'text'
    });
  }

  public getProjectTextData(project_id: string, text_id: string) {
    const url = `${this.oraccBaseUrl}/${project_id}/${text_id}`;
    return this.http.get(url, {
      responseType: 'text'
    });
  }

  public getSubsequentGlossaryArticleData(project: string, sig: string) {
    const bio = '\u2623'; // force encoding always to be utf8
    const encodedString = encodeURIComponent(bio + sig);
    return this.http.get(`${environment.glossaryArticleURL}/${project}?sig=${encodedString}`, {
      responseType: 'text'
    });
  }

  // Shares the search term between search-suggestions, search and search-results
  public setSearchParam(searchParam: string) {
    this.searchParam = searchParam;
  }

  // Get information from the oracc server.
  // project is neo or rimanum or whatever.
  // language is language code, such as akk or sux.
  // isid is the instance set ID, such as sux.r000003
  // options has the following possible keys:
  // - zoom: The zoom item (if the metadata was clicked)
  // - page: The page number for pagination (from 1)
  // - ref: The item ref, such as P405163.13
  public getDetailData(project, language, isid, options) {
    let url: string = `${this.oraccBaseUrl}/${project}/${language}?xis=${isid}`;
    ['ref', 'zoom', 'page'].forEach(v => {
      if (v in options && options[v] !== null) {
        url += `&${v}=${options[v]}`;
      }
    });
    return this.http.get(url, { responseType: 'text' });
  }

  public getScoreData(project: string, ref: string, bloc: string) {
    // actually score?
    let url = `${this.oraccBaseUrl}/${project}/${ref}?block=${bloc}`;
    return this.http.get(url, {
      responseType: 'text'
    });
  }
}
