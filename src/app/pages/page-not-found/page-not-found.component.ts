import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.component.scss'],
    standalone: false
})
export class PageNotFoundComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  public handleHomeRedirect(e) {
    e.preventDefault();
    this.router.navigate(['/']);
  }
}
