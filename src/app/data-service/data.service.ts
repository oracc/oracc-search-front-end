import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DataService {

  constructor(public http:HttpClient) {
    console.log("Data service connected...")
  }

  // TODO Can we get a better type for this that works with the table?
  // See also https://angular.io/guide/http#type-checking-the-response
  getEntries(count: number, after?:string): any {
    let searchParams: { [param: string]: string} = {count: count.toString()};
    if (after != undefined) {
      searchParams['after'] = after.toString();
    }
    return this.http.get(`http://${window.location.hostname}:5000/search_all`,
                        {params: searchParams});
  }

  getAllEntries(): any {
    return this.http.get(`http://${window.location.hostname}:5000/search_all`);
  }

  searchWord(query: string): any {
    return this.http.get(`http://${window.location.hostname}:5000/search/${query}`);
  }
}
