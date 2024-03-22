import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GetDataService } from '../../services/get-data/get-data.service';
import { HandleBreadcrumbsService } from 'src/app/services/handle-breadcrumbs/handle-breadcrumbs.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
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
  private all: any;
  private pathnameArray = window.location.pathname.slice(1).split('/');
  private isMobile: boolean;
  private breadcrumbLink = getBreadcrumbs();

  constructor(
    private getDataService: GetDataService,
    private breadcrumbsService: HandleBreadcrumbsService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    this.breadcrumbsService.setBreadcrumbs(this.breadcrumbLink);
  }

  ngOnInit() {
    this.getDataService.getDetailData().subscribe((data) => {
      this.handleTextToHTMLConversion(data);
    });
    this.chosenTermText = this.getDataService.getChosenTermText();
    this.isMobile = window.innerWidth < 991 ? true : false;
  }

  private handleTextToHTMLConversion(text: string, isTermData = false) {
    const parser = new DOMParser();
    const htmlData = parser.parseFromString(text, 'text/html');
    const htmlDataToBeReduced = parser.parseFromString(text, 'text/html');
    const allInput = htmlData.getElementsByTagName('body')[0];
    const metadataPanelInput = htmlData.getElementById('p3left');
    const middlePanelInput = htmlData.getElementById('p3right');
    const textPanelInput = htmlDataToBeReduced.getElementById('p3right');

    middlePanelInput.querySelectorAll('td').forEach((node) => {
      if (node.className === 't1 xtr') {
        if (typeof node.remove === 'function') {
          node.remove();
        } else {
          node.outerHTML = '';
        }
      }
    });
    textPanelInput.querySelectorAll('td').forEach((node) => {
      if (node.className !== 't1 xtr') {
        if (typeof node.remove === 'function') {
          node.remove();
        } else {
          node.outerHTML = '';
        }
      }
    });

    const controlsInput = htmlData.getElementById('p3controls');

    this.totalLines = parseInt(
      controlsInput.querySelector(
        '.p3-pages .p3toccenter.bg-dk span:nth-of-type(5)'
      ).innerHTML,
      10
    );
    this.totalPages = Array(
      parseInt(
        controlsInput.querySelector(
          '.p3-pages .p3toccenter.bg-dk span:nth-of-type(6)'
        ).innerHTML,
        10
      )
    )
      .fill(1)
      .map((e, i) => i + 1);
    this.shouldShowPaginationArrows = this.totalPages.length > 6;
    this.paginatedPages = this.totalPages.slice(
      this.paginationSliceStart,
      this.paginationSliceEnd
    );

    this.all = this.sanitizer.bypassSecurityTrustHtml(allInput.innerHTML);

    if (isTermData) {
      this.isTermDataShown = true;
      this.totalTexts = parseInt(
        controlsInput.querySelector(
          '#p3navRight .p3-items .p3toccenter.bg-dk span:nth-of-type(5)'
        ).innerHTML,
        10
      );

      this.metadataPanel = "<i class='fas fa-spinner'></i>";
      this.metadataPanel = this.sanitizer.bypassSecurityTrustHtml(
        metadataPanelInput.innerHTML
      );

      this.middlePanel = "<i class='fas fa-spinner'></i>";
      this.middlePanel = this.sanitizer.bypassSecurityTrustHtml(
        middlePanelInput.innerHTML
      );

      this.textPanel = "<i class='fas fa-spinner'></i>";
      this.textPanel = this.sanitizer.bypassSecurityTrustHtml(
        textPanelInput.innerHTML
      );
    } else {
      this.isTermDataShown = false;
      this.middlePanel = this.sanitizer.bypassSecurityTrustHtml(
        middlePanelInput.innerHTML
      );
    }

    this.metadataPanel = this.sanitizer.bypassSecurityTrustHtml(
      metadataPanelInput.innerHTML
    );
  }

  private handleTextToHTMLConversionOnPageChange(text) {
    const parser = new DOMParser();
    const htmlData = parser.parseFromString(text, 'text/html');
    const p3content = htmlData.querySelector('#p3right');
    const middlePanelInput = p3content? p3content : htmlData.querySelector('body');

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

    const idParam = !!anchorEl
      ? anchorEl.href
          .split(':')
          [anchorEl.href.split(':').length - 1].split("'")[0]
      : '';

    if (idParam) {
      // navigates to details texts component
      this.router.navigate([decodeURI(this.router.url), 'texts']);
      this.getDataService.setTermDataParam(idParam);
    }
  }

  public handleMetadataClick(e) {
    if (this.getDataService.p3ZoomGx(e.target, (data) => {
      this.handleTextToHTMLConversionOnPageChange(data);
    })) {
      e.preventDefault();
    }
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
