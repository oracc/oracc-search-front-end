import { Component, OnInit, SecurityContext, ViewEncapsulation } from '@angular/core';
import { GetDataService } from '../../services/get-data/get-data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HandleBreadcrumbsService } from '../../services/handle-breadcrumbs/handle-breadcrumbs.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  composedPath,
  splitOutTranslations,
  findAttribute,
  findAttributeOnTag,
  findAttributeBy,
  findAncestorByTag
} from '../../../utils/utils';
import { DIRECTION, PANEL_TYPE, SESSION_KEYS } from '../../../utils/consts';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-details-texts',
  templateUrl: './details-texts.component.html',
  styleUrls: ['../details/details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailsTextsComponent implements OnInit {
  public metadataPanel: any = "<i class='fas fa-spinner'></i>";
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
  private project: string = 'neo';
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
    const proj = this.route.snapshot.queryParams['proj'];
    if (proj) {
      this.project = proj;
    }
    const paramMap = this.route.snapshot.paramMap;

    if (paramMap.get('projectId') !== null) {
      // user accesses project text by entering a url manually
      this.getDataService.getProjectTextData(paramMap).subscribe((data) => {
        this.handleTextToHTMLConversion(data, true);
      });
    } else {
      // user accesses project texts via the search functionality
      //this.getDataService.getTermData().subscribe((data) => {
      //  this.handleTextToHTMLConversion(data, true);
      //});
      this.getDataService.getDetailData2(
        this.project,
        this.route.snapshot.queryParams['lang'],
        this.route.snapshot.queryParams['isid'],
        {ref: this.route.snapshot.queryParams['iref']}
      ).subscribe((data) => {
        this.handleTextToHTMLConversionP4(data, true);
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
  }

  private handleTextToHTMLConversionP4(text: string, isTermData = false) {
    const parser = new DOMParser();
    const htmlData = parser.parseFromString(text, 'text/html');
    const outlineInput = htmlData.getElementById('p4MenuOutline');
    const metadataInput = htmlData.getElementById('p4XtfMeta');

    const controlsInput = htmlData.getElementById('p4PageNav');

    this.metadataPanel = "<i class='fas fa-spinner'></i>";
    let m = document.createElement('div');
    m.append(metadataInput, outlineInput);
    this.metadataPanel = this.sanitizer.bypassSecurityTrustHtml(m.innerHTML);

    this.handleTextToHTMLConversionText(htmlData, 'p4XtfData');
  }

  private handleTextToHTMLConversionText(htmlData: Document, middleId: string) {
    let middlePanelInput = htmlData.getElementById(middleId);
    this.middlePanel = "<i class='fas fa-spinner'></i>";
    this.textPanel = "<i class='fas fa-spinner'></i>";
    const textPanelInput = splitOutTranslations(middlePanelInput);
    this.middlePanel = this.sanitizer.bypassSecurityTrustHtml(
      middlePanelInput.innerHTML
    );
    this.textPanel = this.sanitizer.bypassSecurityTrustHtml(
      textPanelInput.innerHTML
    );
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
    const anchorEl = findAncestorByTag(e.target, 'a');
    if (!anchorEl) {
      // Are we in the <h1> tag containing an external link to the text source?
      const els = e.target.getElementsByTagName('a');
      if (els.length != 0) {
        window.open(els[0].getAttribute('href'), '_blank');
      }
      return;
    }

    const bloc = findAttribute(anchorEl, 'data-bloc');
    if (bloc) {
      // We are looking at a score number (number on the left, not
      // prefixed by 'o').
      const ref = findAttributeOnTag(e.target, 'id', 'tr');
      if (ref) {
        this.router.navigate([
          'search-results',
          this.route.snapshot.paramMap.get('word'),
          'occurrences',
          'texts',
          'source'
        ], {
          queryParams: {
            iref: ref,
            bloc: bloc
          }
        });
      }
      console.log("Cannot find associated TR element for this data-bloc attribute");
      return;
    }
    const wsig = anchorEl.getAttribute('data-wsig');
    const ref = findAttributeBy(e.target, 'id', (el) => {
      return el.classList.contains('w');
    });

    if (this.route.snapshot.paramMap.get('projectId') !== null) {
      // set the navigation link manually when searching for project text id's in the url bar
      // slightly different routes are used for desktop and mobile
      // need to test this, I doubt it works...
      //...
      let url = '/search-results/id/occurrences/texts';

      this.router.navigate([url, anchorEl.innerText]);
    } else {
      this.router.navigate([
        'search-results',
        this.route.snapshot.paramMap.get('word'),
        'occurrences',
        'texts',
        anchorEl.innerText
      ],{
        queryParams: {
        ref: ref,
        lang: this.route.snapshot.queryParams['lang'],
        isid: this.route.snapshot.queryParams['isid'],
        wsig: wsig
      }});
    }
    // this is irrelevant now unless that subsequentPageVisit=true thing does anything
    console.log(`subsequent: ${wsig}`);
    this.getDataService.setSubsequentGlossaryArticleParam(wsig);
  }

  public handleMetadataClick(e) {
    e.preventDefault();
    const clickedLink = findAncestorByTag(e.target, 'a');
    if (!clickedLink) {
      return;
    }
    const zoom = clickedLink.getAttribute('data-zoom');
    if (zoom) {
      this.getDataService.getDetailData2(
        this.project,
        this.route.snapshot.queryParams['lang'],
        this.route.snapshot.queryParams['isid'], {
          ref: this.route.snapshot.queryParams['iref'],
          zoom: zoom
        }
      ).subscribe((data) => {
        // this doesn't seem to work! It seems when you have ref=, zoom= doesn't have an effect. Ask Steve...
        const parser = new DOMParser();
        const htmlData = parser.parseFromString(data, 'text/html');
        this.handleTextToHTMLConversionText(htmlData, 'p4XtfData');
        console.log(`details texts component zoom: ${zoom}`);
      });
    } else {
      window.open(clickedLink.getAttribute('href'));
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
      this.getDataService.getDetailData2(
        this.project,
        this.route.snapshot.queryParams['lang'],
        this.route.snapshot.queryParams['isid'],
        { page: this.currentPage,
          ref: this.route.snapshot.queryParams['iref']
        }
      ).subscribe((data) => {
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
