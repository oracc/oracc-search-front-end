import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HandleBreadcrumbsService {
  public breadcrumbsLinks = [];

  constructor() {}

  public setBreadcrumbs(router: Router) {
    // Split URL and remove empty segments
    const urlSegments = router.url.split('?')[0].split('/').filter(
      (segment) => segment !== ''
    );
    let currentPath = '/';

    urlSegments.forEach((segment, index) => {
      // decode the name and path segments to display special characters correctly
      const decodedPath = decodeURI(segment);
      currentPath += `${decodedPath}/`;
      if (this.breadcrumbsLinks.length <= index || this.breadcrumbsLinks[index].url !== currentPath) {
        this.breadcrumbsLinks.splice(index, Infinity, {
          name: decodedPath.replaceAll('-', ' '),
          url: currentPath
        });
      }
    });
    if (urlSegments.length < this.breadcrumbsLinks.length) {
      this.breadcrumbsLinks.splice(urlSegments.length, Infinity);
    }
  }

  public getBreadcrumbs() {
    return this.breadcrumbsLinks;
  }
}
