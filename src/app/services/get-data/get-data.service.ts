import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ParamMap } from '@angular/router';
import { environment } from '../../../environments/environment';

const p3zoomgx = new RegExp("p3zoomgx\\('([^']*)', *'([^']*)', *'([^']*)', *([^)]*)\\)");

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
  private zoomItem: string;

  private chosenTerm: string;
  private termDataParam: string;
  private sourceParams: string[];

  private glossaryArticleParam: string;
  private subsequentPageVisit = false;

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

  public getGlossaryArticleData() {
    return this.http.get(`${this.glossaryArticleURL}${this.lang}/${this.id}`, {
      responseType: 'text'
    });
  }

  public getProjectTextData(params: ParamMap) {
    const projectId = params.get('projectId');
    const textId = params.get('textId');

    const url = `${this.oraccBaseUrl}/${projectId}/${textId}?html`;

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

  public getSubsequentGlossaryArticleData(project: string, sig: string) {
    const bio = '\u2623'; // force encoding always to be utf8
    const encodedString = encodeURIComponent(bio + sig);
    return this.http.get(`${environment.glossaryArticleURL}/${project}?sig=${encodedString}`, {
      responseType: 'text'
    });
    // old style:
//    return this.http.get(this.glossaryArticleURL + 'sig?' + encodedString, {
//      responseType: 'text'
//    });
  }

  public setSearchParam(searchParam: string) {
    this.searchParam = searchParam;
  }

  public setGlossaryLangAndId(lang: string, id: string) {
    this.lang = lang;
    this.id = id;
  }

  public getDetailData() {
    return this.getDetailDataPage(null);
  }

  public isZoomed() {
    return this.zoomItem != null;
  }

  public getDetailDataPage(pageNumber) {
    const zoom = this.zoomItem == null? "" : `&zoom=${this.zoomItem}`;
    const page = pageNumber == null? "" : `&page=${pageNumber}`;
    return this.http.get(
      `${this.oraccBaseUrl}/${this.urlParam}/${this.language}?xis=${this.queryString}${zoom}${page}`,
      { responseType: 'text' }
    );
  }

  // Get information from the oracc server.
  // project is neo or rimanum or whatever.
  // language is language code, such as akk or sux.
  // isid is the instance set ID, such as sux.r000003
  // options has the following possible keys:
  // - zoom: The zoom item (if the metadata was clicked)
  // - page: The page number for pagination (from 1)
  // - ref: The item ref, such as P405163.13
  public getDetailData2(project, language, isid, options) {
    let url: string = `${this.oraccBaseUrl}/${project}/${language}?xis=${isid}`;
    ['ref', 'zoom', 'page'].forEach(v => {
      if (v in options) {
        url += `&${v}=${options[v]}`;
      }
    });
    return this.http.get(url, { responseType: 'text' });
  }

  // Get information for score data from the oracc server.
  // project might be neo or rimanum.
  // 
  private findParent(element, condition) {
    while (element) {
      if (condition(element)) {
        return element;
      }
      element = element.parent;
    }
    return null;
  }

  public p3ZoomGx(element, callback) {
    if (!element) {
      return false;
    }
    const el = this.findParent(element, el => el.hasAttribute('onclick'));
    if (!el) {
      return false;
    }
    const call = el.attributes['onclick'].nodeValue;
    const args = p3zoomgx.exec(call);
    if (!args) {
      return false;
    }
    this.setDetailsPageParams('neo', args[2], args[3], args[4]);
    this.getDetailData().subscribe(callback);
    return true;
  }

  public resetDetailZoom(callback) {
    this.zoomItem = null;
    this.getDetailData().subscribe(callback);
  }

  public setDetailsPageParams(
    urlParam: string,
    language: string,
    queryString: string,
    zoomItem?: string,
  ) {
    this.urlParam = urlParam;
    this.language = language;
    this.queryString = queryString;
    this.zoomItem = zoomItem == undefined? null : zoomItem;
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

  public getSourceData(project: string, ref: string, bloc: string) {
    let url = `${this.oraccBaseUrl}/${project}/${ref}?block=${bloc}`;
    return this.http.get(url, {
      responseType: 'text'
    });
  }

  public getPopupData(project: string, item: string, blockId: string) {
    return this.http.get(
      `${this.oraccBaseUrl}/${project}/${item}/score?${blockId}`,
      {
        responseType: 'text'
      }
    );
  }
}
