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
  public preventBreadcrumbsAdd = {
    shouldPrevent: false,
    linkId: null
  };

  constructor(
    private router: Router,
    private breadcrumbsService: HandleBreadcrumbsService
  ) {
    this.router.events.subscribe((val) => {
      if (this.preventBreadcrumbsAdd.shouldPrevent) {
        this.breadcrumbsLinks.splice(
          this.preventBreadcrumbsAdd.linkId + 1,
          100
        );
        this.preventBreadcrumbsAdd.shouldPrevent = false;
      }
      this.breadcrumbsLinks = this.breadcrumbsService.getBreadcrumbs();
    });
  }

  public handleBreadcrumbClick(e, link, id, data?) {
    this.preventBreadcrumbsAdd.shouldPrevent = true;
    this.preventBreadcrumbsAdd.linkId = id;
    this.router.navigate([link], { state: { data } });
  }
}
