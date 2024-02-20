import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GetDataService } from '../../services/get-data/get-data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HandleBreadcrumbsService } from '../../services/handle-breadcrumbs/handle-breadcrumbs.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { composedPath, getBreadcrumbs } from '../../../utils/utils';
import { DIRECTION, PANEL_TYPE, SESSION_KEYS } from '../../../utils/consts';

@Component({
  selector: 'app-details-texts',
  templateUrl: './details-texts.component.html',
  styleUrls: ['../details/details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailsTextsComponent implements OnInit {
  public metadataPanel: any = "<i class='fas fa-spinner'></i>";
  public unsanatizedMetadataPanel: any;
  public currentPage = 1;
  public textPanel: any;
  public chosenTermText: string;
  public isMetadataPanelActive = window.innerWidth > 991 ? true : false;
  public totalTexts: number;
  public totalPages: any;
  public paginatedPages: any;
  public middlePanel: any = "<i class='fas fa-spinner'></i>";
  public isTextPanelActive = window.innerWidth > 991 ? true : false;
  public shouldShowPaginationArrows: boolean;
  private paginationSliceStart: number = 0;
  private paginationSliceEnd: number = 7;
  private totalLines: number;
  private isTermDataShown: boolean;
  private pathnameArray = window.location.pathname.slice(1).split('/');
  private isMobile: boolean;
  private paramMap: ParamMap;

  private breadcrumbLink = getBreadcrumbs();

  constructor(
    private getDataService: GetDataService,
    private breadcrumbsService: HandleBreadcrumbsService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.breadcrumbsService.setBreadcrumbs(this.breadcrumbLink);
  }

  ngOnInit() {
    const paramMap = this.route.snapshot.paramMap;
    const projectId = paramMap.get('projectId');

    if (projectId !== null) {
      // user accesses project text by entering a url manually
      this.getDataService.getProjectTextData(paramMap).subscribe((data) => {
        this.handleTextToHTMLConversion(data, true);
      });
    } else {
      // user accesses project texts via the search functionality
      this.getDataService.getTermData().subscribe((data) => {
        this.handleTextToHTMLConversion(data, true);
      });
      this.chosenTermText = this.getDataService.getChosenTermText();
    }

    this.isMobile = window.innerWidth < 991 ? true : false;
  }

  private handleTextToHTMLConversion(text: string, isTermData = false) {
    const parser = new DOMParser();
    const htmlData = parser.parseFromString(text, 'text/html');
    const htmlDataToBeReduced = parser.parseFromString(text, 'text/html');
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
    this.totalPages = Array(
      parseInt(
        controlsInput.querySelector(
          '.p3-pages .p3toccenter.bg-dk span:nth-of-type(6)'
        ).innerHTML,
        10
      )
    )
      .fill(1)
      .map((e, i) => i);
    this.shouldShowPaginationArrows = this.totalPages.length > 6;
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

    this.unsanatizedMetadataPanel = metadataPanelInput.innerHTML;
  }

  private handleTextToHTMLConversionOnPageChange(text: string) {
    const parser = new DOMParser();
    const htmlData = parser.parseFromString(text, 'text/html');
    const middlePanelInput = htmlData.querySelector('body');

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

    const anchorElWrapper = e.path
      ? e.path.find((el) => {
          return !!el.className ? el.className.includes('w ') : '';
        })
      : composedPath(e.target).find((el) => {
          return !!el.className ? el.className.includes('w ') : '';
        });
    if (anchorEl) {
      const queryParams = !!anchorEl.attributes[1]
        ? anchorEl.attributes[1].nodeValue
            .split('(')
            .slice(1)
            .join()
            .slice(0, -1)
            .replace(/'/g, '')
            .split(' , ')
        : [];

      if (anchorEl.href.includes('showexemplar')) {
        sessionStorage.setItem(
          SESSION_KEYS.METADATA_CONTENT,
          this.unsanatizedMetadataPanel
        );
        this.router.navigate([this.router.url, 'source'], {
          state: { data: this.unsanatizedMetadataPanel }
        });
      } else {
        if (!!anchorElWrapper) {
          const pureQueryParam = `${
            queryParams[queryParams.length - 1].split('=')[0]
          }=${anchorElWrapper.title}`;

          if (this.route.snapshot.paramMap.get('projectId') !== null) {
            // set the navigation link manually when searching for project text id's in the url bar
            // slightly different routes are used for desktop and mobile

            let url = this.isMobile
              ? '/search-results/id/occurrences/texts'
              : '/search/search-results/id/occurrences/texts';

            this.router.navigate([url, anchorEl.innerText]);
          } else {
            this.router.navigate([
              decodeURI(this.router.url),
              anchorEl.innerText
            ]);
          }

          this.getDataService.setSubsequentGlossaryArticleParam(pureQueryParam);
        }
      }
    }
  }

  public handleMetadataClick(e) {
    e.preventDefault();
    const clickedLink = e.path
      ? e.path.find((el) => {
          return el.href;
        })
      : composedPath(e.target).find((el) => {
          return el.href;
        });
    if (!!clickedLink) {
      if (clickedLink.href.startsWith('javascript')) {
        const queryParams = clickedLink.href
          .split('(')
          .slice(1)
          .join()
          .slice(0, -1)
          .replace(/'/g, '')
          .split(',');

        sessionStorage.setItem(
          SESSION_KEYS.METADATA_CONTENT,
          this.unsanatizedMetadataPanel
        );
        this.getDataService.setSourceParams(queryParams);
        this.router.navigate([this.router.url, 'source'], {
          state: { data: this.unsanatizedMetadataPanel }
        });
      } else {
        window.open(clickedLink.href);
      }
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

  public handleTranslationClick(e) {
    const clickedLine = e.path
      ? e.path.find((el) => {
          return el.localName === 'tr';
        })
      : composedPath(e.target).find((el) => {
          return el.localName === 'tr';
        });

    if (!!clickedLine) {
      const centralPanelLine: HTMLElement = clickedLine.id
        ? document.getElementById(clickedLine.id)
        : document.querySelector('.js-panel-central');
      const centralPanel = document.querySelector('.js-panel-central');
      const rightPanel = document.querySelector('.js-panel-right');

      this.isMobile
        ? centralPanelLine.scrollIntoView()
        : centralPanel.scroll({
            top: centralPanelLine.offsetTop - 50
          });
      rightPanel.querySelectorAll('tr').forEach((el) => {
        el.classList.remove('selected');
      });
      centralPanel.querySelectorAll('tr').forEach((el) => {
        el.classList.remove('selected');
      });
      clickedLine.classList.add('selected');
      centralPanelLine.classList.add('selected');
    }
  }
}
