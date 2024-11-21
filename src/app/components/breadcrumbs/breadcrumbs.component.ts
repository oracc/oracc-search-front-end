import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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
    private route: ActivatedRoute,
    private breadcrumbsService: HandleBreadcrumbsService
  ) {
    this.router.events.subscribe((val) => {
      this.breadcrumbsLinks = this.breadcrumbsService.getBreadcrumbs();
    });
  }

  public handleBreadcrumbClick(num) {
    if (num < this.breadcrumbsLinks.length) {
      const link = this.breadcrumbsLinks[num];
      this.router.navigate([link.url], {queryParams: this.route.snapshot.queryParams});
    }
  }
}
