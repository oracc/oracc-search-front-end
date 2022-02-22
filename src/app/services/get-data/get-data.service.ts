import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ParamMap } from "@angular/router";

@Injectable({
  providedIn: "root"
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

  private searchURL = "https://build-oracc.museum.upenn.edu:5000/search/";
  private glossaryArticleURL = "https://build-oracc.museum.upenn.edu/neo/";
  private baseUrl = "https://build-oracc.museum.upenn.edu/";
  private sourceURL = "http://cdli.ucla.edu/";

  constructor(private http: HttpClient) {}

  public getSearchData() {
    console.log("search: " + this.searchURL + this.searchParam);
    return this.http.get(this.searchURL + this.searchParam);
  }

  public getGlossaryArticleData() {
    console.log(this.glossaryArticleURL + this.lang + "/" + this.id);
    return this.http.get(this.glossaryArticleURL + this.lang + "/" + this.id, {
      responseType: "text"
    });
  }

  // public getProjectTextData(params: ParamMap) {
  //   console.log(params);
  //   console.log(params.get("projectId"));
  //   const project = params.get("projectId");
  //   const subProject = params.get("subprojectId");
  //   const textId = params.get("textId");

  //   const url = subProject
  //     ? `${this.baseUrl}${project}/${subProject}/${textId}/html`
  //     : `${this.baseUrl}${project}/${textId}/html`;

  //   return this.http.get(url, {
  //     responseType: "text"
  //   });
  // }

  public getProjectTextData(params: ParamMap) {
    console.log(params);
    console.log(params.get("projectId"));
    const project = params.get("projectId");
    const subProject = params.get("subprojectId");
    const textId = params.get("textId");

    let url = subProject
      ? `${this.baseUrl}${project}/${subProject}/${textId}`
      : `${this.baseUrl}${project}/${textId}`;

    url = "https://build-oracc.museum.upenn.edu/neo/P322250";

    return this.http.get(url, {
      responseType: "text"
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
    const bio = "\u2623"; // force encoding always to be utf8
    const encodedString = encodeURIComponent(bio + this.glossaryArticleParam);
    return this.http.get(this.glossaryArticleURL + "sig?" + encodedString, {
      responseType: "text"
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
    console.log(
      "detail data: " +
        `${this.baseUrl}${this.urlParam}/${this.language}?xis=${this.queryString}`
    );
    return this.http.get(
      `${this.baseUrl}${this.urlParam}/${this.language}?xis=${this.queryString}`,
      {
        responseType: "text"
      }
    );
  }

  public getDetailDataPage(pageNumber) {
    console.log(
      "detail data page: " +
        `${this.baseUrl}${this.urlParam}/${this.language}/${this.queryString}?page=${pageNumber}`
    );
    return this.http.get(
      `${this.baseUrl}${this.urlParam}/${this.language}/${this.queryString}?page=${pageNumber}`,
      {
        responseType: "text"
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
    console.log(`${this.glossaryArticleURL}${this.termDataParam}`);

    // return this.http.get(`${this.glossaryArticleURL}${this.termDataParam}`, {
    //   responseType: "text"
    // });

    const originalURL = "https://build-oracc.museum.upenn.edu/neo/P322250";
    const testUrl = "https://build-oracc.museum.upenn.edu/dcclt/P322250";

    return this.http.get(testUrl, {
      responseType: "text"
    });
  }

  public setSourceParams(params: string[]) {
    this.sourceParams = params;
  }

  public getSourceData() {
    let sourceDataURL = `${this.baseUrl}${this.sourceParams[0]}/${this.sourceParams[1]}/html`;
    console.log(sourceDataURL);
    if (this.sourceParams[2].length > 0) {
      sourceDataURL = sourceDataURL + "?" + this.sourceParams[2];
      if (this.sourceParams[3].length > 0) {
        sourceDataURL = sourceDataURL + "," + this.sourceParams[3];
      }
    }
    return this.http.get(sourceDataURL, {
      responseType: "text"
    });
  }

  public getPopupData(project: string, item: string, blockId: string) {
    console.log(
      "popup data: " + `${this.baseUrl}${project}/${item}/score?${blockId}`
    );
    return this.http.get(`${this.baseUrl}${project}/${item}/score?${blockId}`, {
      responseType: "text"
    });
  }
}
