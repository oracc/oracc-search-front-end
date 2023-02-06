import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  public isMobile: boolean;

  constructor(private router: Router) {}

  ngOnInit() {
    this.isMobile = window.innerWidth < 991 ? true : false;
  }

  public handleSearchLinkClick(e) {
    e.preventDefault();
    const route = this.isMobile ? '/' : '/search';
    if (e.target.className === 'js-search-home') {
      this.router.navigate([route]);
    }
  }
}
