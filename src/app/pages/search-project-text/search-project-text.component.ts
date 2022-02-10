import { Component, OnInit } from "@angular/core";
import { GetDataService } from "../../services/get-data/get-data.service";
import { HandleBreadcrumbsService } from "../../services/handle-breadcrumbs/handle-breadcrumbs.service";

import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-search-project-text",
  templateUrl: "./search-project-text.component.html",
  styleUrls: ["./search-project-text.component.scss"]
})
export class SearchProjectTextComponent implements OnInit {
  private searchInput: Element;
  private searchButton: HTMLElement;
  public placeholderText: string;
  public isMobile: boolean;
  public routerLink: string;
  public searchParam: string;
  public breadcrumbLink = [
    {
      name: "Search",
      url: "/search"
    }
  ];
  public orderby: string;

  constructor(
    private route: ActivatedRoute,
    private getDataService: GetDataService
  ) {}

  ngOnInit() {
    console.log(this.route.snapshot.params);

    this.isMobile = window.innerWidth < 991 ? true : false;
    this.bindEvents();
  }

  bindEvents() {
    this.searchInput.addEventListener("keydown", (event) => {
      this.searchOnEnter(event);
    });
  }

  setSearchParam(searchParam: string) {
    this.getDataService.setSearchParam(searchParam);
  }

  searchOnEnter(event) {
    event.stopImmediatePropagation(); // prevents repeated api calls

    if (event.code === "Enter") {
      this.searchButton.click();
      event.target.blur();
    }
  }
}
