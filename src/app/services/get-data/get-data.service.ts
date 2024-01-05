import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ParamMap } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GetDataService {
  private searchParam: string;
  private lang: string;
  private id: string;

  private urlParam: string;
  private language: string;
  private queryString: string;

  private chosenTerm: string;
  private termDataParam: string;
  private sourceParams: string[];

  private glossaryArticleParam: string;
  private subsequentPageVisit = false;

  private sourceURL = 'http://cdli.ucla.edu/';

  private baseUrl = environment.apiUrl;
  private searchURL = `${this.baseUrl}:${environment.port}/search/`;
  private glossaryArticleURL = `${environment.glossaryArticleURL}/neo/`;
  private searchSuggestionsUrl = `${this.baseUrl}:${environment.port}/suggest_all/`;

  constructor(private http: HttpClient) {}

  public getSearchData() {
    return this.http.get(this.searchURL + this.searchParam);
  }

  public getSearchSuggestionsData(partialSearchTerm: string) {
    return this.http.get(this.searchSuggestionsUrl + partialSearchTerm);
  }

  public getGlossaryArticleData() {
    return this.http.get(this.glossaryArticleURL + this.lang + '/' + this.id, {
      responseType: 'text'
    });
  }

  public getProjectTextData(params: ParamMap) {
    const projectId = params.get('projectId');
    const subProjectId = params.get('subprojectId');
    const textId = params.get('textId');

    const url = subProjectId
      ? `${this.baseUrl}/${projectId}/${subProjectId}/${textId}`
      : `${this.baseUrl}/${projectId}/${textId}`;

    return this.http.get(url, {
      responseType: 'text'
    });
  }

  public setSubsequentGlossaryArticleParam(param: string) {
    this.glossaryArticleParam = param;
    this.subsequentPageVisit = true;
  }

  public isSubsequentPageVisit() {
    return this.subsequentPageVisit;
  }

  public setIsSubsequentPageVisit(isSubsequent: boolean) {
    this.subsequentPageVisit = isSubsequent;
  }

  public getSubsequentGlossaryArticleData() {
    const bio = '\u2623'; // force encoding always to be utf8
    const encodedString = encodeURIComponent(bio + this.glossaryArticleParam);
    return this.http.get(this.glossaryArticleURL + 'sig?' + encodedString, {
      responseType: 'text'
    });
  }

  public setSearchParam(searchParam: string) {
    this.searchParam = searchParam;
  }

  public setGlossaryLangAndId(lang: string, id: string) {
    this.lang = lang;
    this.id = id;
  }

  public getDetailData() {
    return this.http.get(
      `${this.baseUrl}/${this.urlParam}/${this.language}?xis=${this.queryString}`,
      {
        responseType: 'text'
      }
    );
  }

  public getDetailDataPage(pageNumber) {
    return this.http.get(
      `${this.baseUrl}/${this.urlParam}/${this.language}/${this.queryString}?page=${pageNumber}`,
      {
        responseType: 'text'
      }
    );
  }

  public setDetailsPageParams(
    urlParam: string,
    language: string,
    queryString: string
  ) {
    this.urlParam = urlParam;
    this.language = language;
    this.queryString = queryString;
  }

  public setChosenTermText(term: string) {
    this.chosenTerm = term;
  }

  public getChosenTermText() {
    return this.chosenTerm;
  }

  public setTermDataParam(param: string) {
    this.termDataParam = param;
  }

  public getTermData() {
    return this.http.get(`${this.glossaryArticleURL}${this.termDataParam}`, {
      responseType: 'text'
    });
  }

  public setSourceParams(params: string[]) {
    this.sourceParams = params;
  }

  public getSourceData() {
    let sourceDataURL = `${this.baseUrl}/${this.sourceParams[0]}/${this.sourceParams[1]}/html`;

    if (this.sourceParams[2].length > 0) {
      sourceDataURL = sourceDataURL + '?' + this.sourceParams[2];
      if (this.sourceParams[3].length > 0) {
        sourceDataURL = sourceDataURL + ',' + this.sourceParams[3];
      }
    }
    return this.http.get(sourceDataURL, {
      responseType: 'text'
    });
  }

  public getPopupData(project: string, item: string, blockId: string) {
    return this.http.get(
      `${this.baseUrl}/${project}/${item}/score?${blockId}`,
      {
        responseType: 'text'
      }
    );
  }
}
