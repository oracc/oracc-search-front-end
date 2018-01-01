import { Component } from '@angular/core';
import { DataService } from './data.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Search results'; 

  
  constructor(private dataService:DataService) {

  }

  entries = []

  ngOnInit() {

      this.dataService.getEntries().subscribe((entries) => {

          console.log(entries);
          this.entries = entries
      });
  }  
    
  //sorting
  key: string = 'headword'
  reverse: boolean = false;
  sort(key){
    this.key = key;
    this.reverse = !this.reverse;
  }
  p: number = 1;
}
