import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { Observable } from 'rxjs';

import {  PANEL_TYPE } from '../../utils/consts';
import { GetDataService } from '../services/get-data/get-data.service';
import { HandleBreadcrumbsService } from 'src/app/services/handle-breadcrumbs/handle-breadcrumbs.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

// ThreePanel is a base class for all pages that have the
// Metadata/Details/Texts panels.
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
  public translate: TranslateService = inject(TranslateService);
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
  readonly paginationButtonCount = 6;
  public pageCount = 1;
  public paginatedPages: number[] = [];
  public paginationSliceStart: number = 1;
  public paginationSliceEnd: number = 7;
  public topText: string;
  public prev_item : string | null = null;
  public next_item : string | null = null;

  public ngOnInit(): void {
    // Are we on a narrow (probably mobile) screen?
    this.isMobile = window.innerWidth <= 600;
    // The metadata (first) and text (third) panels should be
    // collapsed by default on mobile (the three panels are
    // vertically stacked in this case).
    this.isMetadataPanelActive = !this.isMobile;
    this.isTextPanelActive = !this.isMobile;
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.setup();
      }
    });
    this.initialize();
    this.setup();
  }

  // override this to capture information from the route before
  // getBackendData, for example.
  public initialize() {}

  public setup() : void {
    this.breadcrumbsService.setBreadcrumbs(this.router);
    const proj = this.route.snapshot.queryParams['proj'];
    if (proj) {
      this.project = proj;
    }
    // no page chosen, no zoom
    this.currentPage = null;
    this.zoom = null;
    this.chosenTermText = this.route.snapshot.paramMap.get('word');
    // All three panels need the spinner
    const spinner = "<i class='fas fa-spinner'></i>";
    this.metadataPanel = spinner;
    this.middlePanel = spinner;
    this.textPanel = spinner;
    // Initialize the three panels with data from the backend
    this.getBackendData().subscribe((text) => {
      const parser = new DOMParser();
      const htmlData = parser.parseFromString(text, 'text/html');
      this.setMetadataPanel(htmlData);
      this.setMiddlePanelAndPages(htmlData);
    });
  }

  // Update just the middle panel on page change or zoom
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

  // update the middle panel with HTML received from the backend, and
  // set the page buttons appropriately for how many pages there are.
  public setMiddlePanelAndPages(htmlData) {
    const pager = htmlData.getElementById('p4Pager');
    if (pager) {
      if (pager.hasAttribute('data-prev')) {
        this.prev_item = pager.getAttribute('data-prev');
        if (this.prev_item == "") {
          this.prev_item = null;
        }
      }
      if (pager.hasAttribute('data-next')) {
        this.next_item = pager.getAttribute('data-next');
        if (this.next_item == "") {
          this.next_item = null;
        }
      }
    }
    console.log(`pager ${pager} ${this.prev_item} ${this.next_item}`);
    this.setMiddlePanel(htmlData);
    const itemControls = htmlData.getElementById('p4itemNav');
    let topTextArguments = [];
    // set total lines, if we know
    if (itemControls && itemControls.hasAttribute('data-imax')) {
      const total = parseInt(itemControls.getAttribute('data-imax'), 10);
      const index = itemControls.hasAttribute('data-inth')?
        parseInt(itemControls.getAttribute('data-inth'), 10) : null;
      topTextArguments = [total, index];
    }
    this.translate.get(
      this.detailsPanelTopText(),
      topTextArguments
    ).subscribe(text => { this.topText = text; });
    // set pagination controls, if we know how many pages
    const navControls = htmlData.getElementById('p4PageNav');
    if (!navControls || !navControls.hasAttribute('data-pmax')) {
      return;
    }
    this.pageCount = parseInt(
      navControls.getAttribute('data-pmax'),
      10
    );
    if (this.currentPage === null) {
      this.currentPage = 1;
    } else if (this.pageCount < this.currentPage) {
      this.currentPage = this.pageCount;
    }
    this.updatePaginationPages();
  }

  // Update the page buttons after page change or zoom
  private updatePaginationPages() {
    const minRequiredPage = Math.max(this.currentPage - 1, 1);
    const maxRequiredPage = Math.min(this.currentPage + 1, this.pageCount);
    const requiredSize = Math.min(this.pageCount, this.paginationButtonCount);
    if (this.paginationSliceEnd - this.paginationSliceStart !== requiredSize) {
      // we seem to have changed to a different set of pages
      this.paginationSliceStart = 1;
      this.paginationSliceEnd = Math.min(this.pageCount, this.paginationButtonCount) + 1;
    }
    if (minRequiredPage < this.paginationSliceStart) {
      this.paginationSliceStart = minRequiredPage;
      this.paginationSliceEnd = Math.min(
        this.paginationSliceStart + this.paginationButtonCount,
        this.pageCount + 1
      );
    } else if (this.paginationSliceEnd <= maxRequiredPage) {
      this.paginationSliceEnd = maxRequiredPage + 1;
      this.paginationSliceStart = Math.max(
        this.paginationSliceEnd - this.paginationButtonCount,
        1
      )
    }
    this.paginatedPages = Array(this.paginationSliceEnd - this.paginationSliceStart)
      .fill(1)
      .map((e, i) => i + this.paginationSliceStart);
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

  // Toggle metadata or text panel expand/collapse
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

  // override this to set the internationalization key for the top
  // text of the details (middle) panel
  public detailsPanelTopText(): string {
    return "details.textText";
  }

  // One of the page change buttons was clicked
  public handlePageChange($e: MouseEvent, to_index: number) {
    $e.preventDefault();
    if (to_index !== this.currentPage) {
      this.currentPage = to_index;
      this.updateMiddlePanel();
    }
  }

  public handleResetZoom(e) {
    this.zoom = null;
    this.updateMiddlePanel();
  }

  public isZoomed() {
    return this.zoom != null;
  }

  // override this to handle the user clicking the Text (third) panel
  public handleTextClick(e) {
  }

  // override this to handle prev/next buttons
  public changeText(item: string) {
    console.warn(`moving to ${item} not implemented`);
  }

  public handlePrevious() {
    if (this.prev_item) {
      this.changeText(this.prev_item);
    }
  }

  public handleNext() {
    if (this.next_item) {
      this.changeText(this.next_item);
    }
  }
}
