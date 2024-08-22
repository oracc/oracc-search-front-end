import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';

import { DIRECTION, PANEL_TYPE } from '../../utils/consts';
import { GetDataService } from '../services/get-data/get-data.service';
import { HandleBreadcrumbsService } from 'src/app/services/handle-breadcrumbs/handle-breadcrumbs.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'three-panel-base',
  template: '<p>base component, not to be rendered</p>',
  styles: []
})
export class ThreePanel implements OnInit {
  public route: ActivatedRoute = inject(ActivatedRoute);
  public router: Router = inject(Router);
  public getDataService: GetDataService = inject(GetDataService);
  private breadcrumbsService: HandleBreadcrumbsService = inject(HandleBreadcrumbsService);
  public sanitizer: DomSanitizer = inject(DomSanitizer);
  public metadataPanel: SafeHtml = "";
  public middlePanel: SafeHtml = "";
  public textPanel: SafeHtml = "";
  public isMetadataPanelActive: boolean = false;
  public isTextPanelActive: boolean = false;
  public isMobile: boolean = false;
  public project: string = 'neo';
  public chosenTermText: string = "";
  public currentPage: number | null = null;
  public zoom: number | null = null;
  public paginatedPages: number[] = [];
  public totalPages: number[] = [];
  public shouldShowPaginationArrows: boolean;
  private paginationSliceStart: number = 0;
  private paginationSliceEnd: number = 7;
  public totalLines: number;

  public ngOnInit(): void {
    this.isMobile = window.innerWidth < 991;
    this.isMetadataPanelActive = !this.isMobile;
    this.isTextPanelActive = !this.isMobile;
      this.breadcrumbsService.setBreadcrumbs(this.router);
    const proj = this.route.snapshot.queryParams['proj'];
    if (proj) {
      this.project = proj;
    }
    this.currentPage = null;
    this.zoom = null;
    this.chosenTermText = this.route.snapshot.paramMap.get('word');
    const spinner = "<i class='fas fa-spinner'></i>";
    this.metadataPanel = spinner;
    this.middlePanel = spinner;
    this.textPanel = spinner;
    this.getBackendData().subscribe((text) => {
      const parser = new DOMParser();
      const htmlData = parser.parseFromString(text, 'text/html');
      this.setMetadataPanel(htmlData);
      this.setMiddlePanelAndPages(htmlData);
    });
  }

  public updateMiddlePanel() {
    this.getBackendData().subscribe((text) => {
      const parser = new DOMParser();
      const htmlData = parser.parseFromString(text, 'text/html');
      this.setMiddlePanelAndPages(htmlData);
    });
  }

  public setZoom(zoom: number) {
    if (this.zoom == zoom) {
      return;
    }
    this.zoom = zoom;
    this.currentPage = null;
    this.updateMiddlePanel();
  }

  public setMiddlePanelAndPages(htmlData) {
    this.setMiddlePanel(htmlData);
    const controlsInput = htmlData.getElementById('p4PageNav');
    // set total lines, if we know
    if (controlsInput.hasAttribute('data-imax')) {
      this.totalLines = parseInt(
        controlsInput.getAttribute('data-imax'),
        10
      );
    }
    // set pagination controls, if we know how many pages
    if (!controlsInput.hasAttribute('data-pmax')) {
      return;
    }
    const pageCount = parseInt(
      controlsInput.getAttribute('data-pmax'),
      10
    );
    this.totalPages = Array(pageCount - this.paginationSliceStart)
      .fill(1)
      .map((e, i) => i + 1);
    this.shouldShowPaginationArrows = this.totalPages.length > 6;
    this.paginatedPages = this.totalPages.slice(
      this.paginationSliceStart,
      this.paginationSliceEnd
    );
    if (this.currentPage === null) {
      this.currentPage = 1;
    } else if (pageCount < this.currentPage) {
      this.currentPage = pageCount;
    }
  }

  // override this with code to fetch data from the backend,
  // returning an Angular Observable of an HTTP response.
  public getBackendData(): Observable<string> {
    return this.getDataService.getDetailData(
      this.project,
      this.route.snapshot.queryParams['lang'],
      this.route.snapshot.queryParams['isid'],
      {
        page: this.currentPage,
        zoom: this.zoom
      }
    );
  }

  public togglePanel(e, panelType) {
    if (panelType === PANEL_TYPE.METADATA) {
      this.isMetadataPanelActive = !this.isMetadataPanelActive;
    }
    if (panelType === PANEL_TYPE.TEXT) {
      this.isTextPanelActive = !this.isTextPanelActive;
    }
  }

  // override this to set the Metadata (left) panel from the HTML
  // data got from the backend
  public setMetadataPanel(htmlData: Document) {
    this.metadataPanel = this.sanitizer.bypassSecurityTrustHtml(
      '<div/>'
    );
  }

  // override this to set the Middle and Text (right) panels from
  // the p4Pager element got from the backend
  public setMiddlePanel(htmlData : Document) {
    this.middlePanel = this.sanitizer.bypassSecurityTrustHtml(
      '<div/>'
    );
    this.setTextPanel(htmlData);
  }

  // override this to set the Text (right) panel from the HTML data
  // got from the backend
  public setTextPanel(htmlData : Document) {
    this.textPanel = this.sanitizer.bypassSecurityTrustHtml(
      '<div/>'
    );
  }


  public handlePageChange(e, direction?: string) {
    const oldPage = this.currentPage;
    if (!direction) {
      this.currentPage = parseInt(e.target.innerHTML, 10);
    }
    if (direction === DIRECTION.BACK && this.currentPage >= 1) {
      this.currentPage = this.currentPage - 1 || 1;
    }
    if (
      direction === DIRECTION.FORWARD &&
      this.totalPages.length !== this.currentPage
    ) {
      this.currentPage = this.currentPage + 1;
    }
    if (oldPage !== this.currentPage) {
      this.handlePaginationBoundary(this.currentPage);
      this.updateMiddlePanel();
    }
  }

  private handlePaginationBoundary(currentPage: number) {
    const indexOfCurrentPage = this.paginatedPages.indexOf(currentPage);
    if (
      indexOfCurrentPage === 6 &&
      currentPage < this.totalPages[this.totalPages.length - 1]
    ) {
      this.paginatedPages = this.totalPages.slice(
        (this.paginationSliceStart += 1),
        (this.paginationSliceEnd += 1)
      );
    }
    if (indexOfCurrentPage === 0 && currentPage > 1) {
      this.paginatedPages = this.totalPages.slice(
        (this.paginationSliceStart -= 1),
        (this.paginationSliceEnd -= 1)
      );
    }
  }

  public handleResetZoom(e) {
    this.zoom = null;
    this.updateMiddlePanel();
  }

  public isZoomed() {
    return this.zoom != null;
  }
}
