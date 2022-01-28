import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "page-not-found",
  templateUrl: "./page-not-found.component.html",
  styleUrls: ["./page-not-found.component.scss"]
})
export class PageNotFoundComponent implements OnInit {
  private searchInput: Element;
  private searchButton: HTMLElement;
  public placeholderText: string;
  public isMobile: boolean;
  public routerLink: string;
  public searchParam: string;
  public breadcrumbLink = [
    {
      name: "page-not-found",
      url: "/page-not-found"
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {}

  public handleHomeRedirect(e) {
    e.preventDefault();
    this.router.navigate(["/"]);
  }
}
