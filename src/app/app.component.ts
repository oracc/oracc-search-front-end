import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  public adjustFooter = false;
  public isMobile: boolean;
  public isHome: boolean;
  public isPageNotFound: boolean;

  constructor(private router: Router) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.isHome = val.url === "/";
        this.isPageNotFound = val.urlAfterRedirects === "/404";
      }
    });
  }

  ngOnInit() {
    this.isMobile = window.innerWidth < 991;
    this.isHome = window.location.pathname === "/new";
    this.isPageNotFound = window.location.pathname === "/404";
  }
}
