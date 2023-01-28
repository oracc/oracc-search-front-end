import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HandleBreadcrumbsService {
  public breadcrumbsLinks = [];

  constructor() {}

  public setBreadcrumbs(breadcrumbs) {
    this.breadcrumbsLinks = [];
    this.breadcrumbsLinks = breadcrumbs;
  }

  public getBreadcrumbs() {
    return this.breadcrumbsLinks;
  }
}
