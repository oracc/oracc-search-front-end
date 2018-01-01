import { Injectable } from '@angular/core';
import { Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

  constructor(public http:Http) {
    console.log("Data service connected...")
  }


  getEntries() {
      //return this.http.get("http://localhost:5000/search_all")
      return this.http.get("http://localhost:3000/entries")
          .map(res => res.json());
//    return [
//        {"gw": "\u02beAtean", "headword": "\u02beAtaya[\u02beAtean]EN", "cf": "\u02beAtaya"},
//        {"gw": "the sign A\u2082", "headword": "a[the sign A\u2082]N", "cf": "a"},
//        {"gw": "asdas", "headword": "a[the sign A\u2082]N", "cf": "a"}
//    ];
  }


}
