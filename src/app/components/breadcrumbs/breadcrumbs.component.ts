import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { HandleBreadcrumbsService } from "../../services/handle-breadcrumbs/handle-breadcrumbs.service";

@Component({
  selector: "app-breadcrumbs",
  templateUrl: "./breadcrumbs.component.html",
  styleUrls: ["./breadcrumbs.component.scss"]
})
export class BreadcrumbsComponent {
  public breadcrumbsLinks = [];

  constructor(
    private router: Router,
    private breadcrumbsService: HandleBreadcrumbsService
  ) {
    this.router.events.subscribe((val) => {
      this.breadcrumbsLinks = this.breadcrumbsService.getBreadcrumbs();
    });
  }

  public handleBreadcrumbClick(e, link, id, data?) {
    this.router.navigate([link], { state: { data } });
  }
}
