import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'oracc';

  public adjustFooter = false;
  public isHome: boolean;
  public isPageNotFound: boolean;

  constructor(private router: Router) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.isHome = val.url === '/';
        this.isPageNotFound = val.urlAfterRedirects === '/404';
      }
    });
  }

  ngOnInit() {
  }
}
