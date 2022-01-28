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
        this.isHome = val.url === "/" ? true : false;
        this.isPageNotFound = val.urlAfterRedirects === "/404" ? true : false;
      }
    });

    // this.bindEvents();
  }

  ngOnInit() {
    this.isMobile = window.innerWidth < 991 ? true : false;
    this.isHome = window.location.pathname === "/new" ? true : false;
    this.isPageNotFound = window.location.pathname === "/404" ? true : false;
  }

  // bindEvents() {
  //   window.addEventListener("load", () => {
  //     // tslint:disable-next-line: no-unused-expression
  //     this.router.url !== "/" && this.router.navigate(["/"]);
  //   });
  // }
}
