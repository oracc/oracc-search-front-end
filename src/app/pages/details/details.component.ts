import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GetDataService } from '../../services/get-data/get-data.service';
import { HandleBreadcrumbsService } from 'src/app/services/handle-breadcrumbs/handle-breadcrumbs.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { composedPath, getBreadcrumbs } from '../../../utils/utils';
import { DIRECTION, PANEL_TYPE } from '../../../utils/consts';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailsComponent implements OnInit {
  public metadataPanel: any = "<i class='fas fa-spinner'></i>";
  public currentPage = 1;
  public textPanel: any;
  public chosenTermText: string;
  public isMetadataPanelActive = window.innerWidth > 991 ? true : false;
  public isTermDataShown: boolean;
  public totalTexts: number;
  public totalLines: number;
  public totalPages: any;
  public paginatedPages: any;
  public middlePanel: any = "<i class='fas fa-spinner'></i>";
  public isTextPanelActive = window.innerWidth > 991 ? true : false;
  public shouldShowPaginationArrows: boolean;
  private paginationSliceStart: number = 0;
  private paginationSliceEnd: number = 7;
  private isMobile: boolean;

  constructor(
    private getDataService: GetDataService,
    private breadcrumbsService: HandleBreadcrumbsService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.breadcrumbsService.setBreadcrumbs(this.router);
  }

  ngOnInit() {
    this.getDataService.getDetailData2(
      'neo',
      this.route.snapshot.queryParams['lang'],
      this.route.snapshot.queryParams['isid'],
      {}
    ).subscribe((data) => {
      this.handleTextToHTMLConversion(data);
    });
    this.chosenTermText = this.getDataService.getChosenTermText();
    this.isMobile = window.innerWidth < 991 ? true : false;
  }

  private handleTextToHTMLConversion(text: string) {
    const parser = new DOMParser();
    const htmlData = parser.parseFromString(text, 'text/html');
    const metadataPanelInput = htmlData.getElementById('p4MenuOutline');
    const middlePanelInput = htmlData.getElementById('p4Content');

    const controlsInput = htmlData.getElementById('p4PageNav');

    this.totalLines = parseInt(
      controlsInput.getAttribute('data-imax'),
      10
    );
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

    this.isTermDataShown = false;
    this.middlePanel = this.sanitizer.bypassSecurityTrustHtml(
      middlePanelInput.innerHTML
    );

    this.metadataPanel = this.sanitizer.bypassSecurityTrustHtml(
      metadataPanelInput.innerHTML
    );
  }

  private handleTextToHTMLConversionOnPageChange(text) {
    const parser = new DOMParser();
    const htmlData = parser.parseFromString(text, 'text/html');
    const middlePanelInput = htmlData.getElementById('p4Content');

    this.middlePanel = this.sanitizer.bypassSecurityTrustHtml(
      middlePanelInput.innerHTML
    );
  }

  public handleDetailsClick(e) {
    e.preventDefault();
    const anchorEl = e.path
      ? e.path.find((el) => {
          return el.localName === 'a';
        })
      : composedPath(e.target).find((el) => {
          return el.localName === 'a';
        });

    const ref = anchorEl.getAttribute('data-iref');

    if (ref) {
      // navigates to details texts component
      this.router.navigate(
        ['search-results', this.route.snapshot.paramMap.get('word'), 'occurrences', 'texts'],
        { queryParams: {
          iref: ref,
          lang: this.route.snapshot.queryParams['lang'],
          isid: this.route.snapshot.queryParams['isid']
        }}
      );
    }
  }

  public handleMetadataClick(e) {
    e.preventDefault();
    if (this.getDataService.p3ZoomGx(e.target, (data) => {
      this.handleTextToHTMLConversionOnPageChange(data);
    })) {
      e.preventDefault();
    }
  }

  public handleResetZoom(e) {
    this.getDataService.resetDetailZoom((data) => {
      this.handleTextToHTMLConversionOnPageChange(data);
    });
  }

  public isZoomed() {
    return this.getDataService.isZoomed();
  }

  public togglePanel(e, panelType) {
    if (panelType === PANEL_TYPE.METADATA) {
      this.isMetadataPanelActive = !this.isMetadataPanelActive;
    }
    if (panelType === PANEL_TYPE.TEXT) {
      this.isTextPanelActive = !this.isTextPanelActive;
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

  public handlePageChange(e, direction?: string) {
    if (!direction) {
      this.currentPage = parseInt(e.target.innerHTML, 10);
      this.handlePaginationBoundary(this.currentPage);
      this.getDataService
        .getDetailDataPage(this.currentPage)
        .subscribe((data) => {
          this.handleTextToHTMLConversionOnPageChange(data);
        });
    }
    if (direction === DIRECTION.BACK && this.currentPage >= 1) {
      this.currentPage = this.currentPage - 1 || 1;
      this.handlePaginationBoundary(this.currentPage);
      this.getDataService
        .getDetailDataPage(this.currentPage)
        .subscribe((data) => {
          this.handleTextToHTMLConversionOnPageChange(data);
        });
    }
    if (
      direction === DIRECTION.FORWARD &&
      this.totalPages.length !== this.currentPage
    ) {
      this.currentPage = this.currentPage + 1;
      this.handlePaginationBoundary(this.currentPage);
      this.getDataService
        .getDetailDataPage(this.currentPage)
        .subscribe((data) => {
          this.handleTextToHTMLConversionOnPageChange(data);
        });
    }
  }
}
