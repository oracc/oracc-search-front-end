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
          .map(function(res) {
            let json = res.json();
            // is this more readable?
            //json.map(e => {e.icount = parseInt(e.icount); return e});
            for (var entry of json) {
              entry.icount = parseInt(entry.icount);
            }
            return json
          });
  }


}
