import { Injectable } from '@angular/core';
import { Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

  constructor(public http:Http) {
    console.log("Data service connected...")
  }


  getEntries() {
      return this.http.get(`http://${window.location.hostname}:5000/search_all`)
          .map(res => res.json());
  }
}
