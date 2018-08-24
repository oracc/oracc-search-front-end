import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DataService {

  baseURL: string;

  constructor(public http:HttpClient) {
    console.log("Data service connected...")
    this.baseURL = `http://${window.location.hostname}:5000`;
  }

  // TODO Can we get a better type for this that works with the table?
  // See also https://angular.io/guide/http#type-checking-the-response
  getEntries(count: number, after?:string): any {
    let searchParams: { [param: string]: string} = {count: count.toString()};
    if (after != undefined) {
      searchParams['after'] = after.toString();
    }
    return this.http.get(this.baseURL + "/search_all", {params: searchParams});
  }

  getAllEntries(): any {
    return this.http.get(this.baseURL + "/search_all");
  }

  searchWord(query: string, sortField?: string, asc = true): any {
    let searchParams: { [param: string]: string} = {};
    if (sortField != undefined) {
      searchParams.sort_by = sortField;
      searchParams.dir = asc ? "asc" : "desc";
    }
    return this.http.get(this.baseURL + `/search/${encodeURIComponent(query)}`, {
      params: searchParams
    });
  }
}
