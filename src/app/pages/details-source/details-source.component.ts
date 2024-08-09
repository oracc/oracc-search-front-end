import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GetDataService } from '../../services/get-data/get-data.service';
import { HandleBreadcrumbsService } from 'src/app/services/handle-breadcrumbs/handle-breadcrumbs.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { composedPath, findAncestorByTag, findAttribute, splitOutEnums } from '../../../utils/utils';
import { PANEL_TYPE } from '../../../utils/consts';

@Component({
  selector: 'app-details-source',
  templateUrl: './details-source.component.html',
  styleUrls: ['./details-source.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailsSourceComponent implements OnInit {
  public metadataPanel: any = "<i class='fas fa-spinner'></i>";
  public middlePanel: any = "<i class='fas fa-spinner'></i>";
  public textPanel: any;
  public isDetailsPopupActive: boolean;
  public detailsPopupContent: any;
  public detailsPopupTitle: any;
  public isMetadataPanelActive = window.innerWidth > 991 ? true : false;
  public isTextPanelActive = window.innerWidth > 991 ? true : false;
  private isMobile: boolean;
  private data_project: string = 'neo';

  constructor(
    private getDataService: GetDataService,
    private breadcrumbsService: HandleBreadcrumbsService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.breadcrumbsService.setBreadcrumbs(this.router);
    this.metadataPanel = this.sanitizer.bypassSecurityTrustHtml(
      '<div/>'
    );
    // this seems to fire no matter which page we are on
    //this.router.events.subscribe((event) => {
    //  if (event instanceof NavigationEnd) {
    //    this.populatePanels();
    //  }
    //});
  }

  ngOnInit() {
    this.populatePanels();
    this.isMobile = window.innerWidth < 991 ? true : false;
  }

  private populatePanels() {
    this.getDataService.getSourceData(
      this.route.snapshot.queryParams['proj'],
      this.route.snapshot.queryParams['ref'],
      this.route.snapshot.queryParams['bloc']
    ).subscribe((data: any) => {
      this.handleTextToHTMLConversion(data);
    });
  }

  private handleTextToHTMLConversion(text: string) {
    const parser = new DOMParser();
    const htmlData = parser.parseFromString(text, 'text/html');
    const pager = htmlData.getElementById('p4Pager');
    if (pager.hasAttribute('data-proj')) {
      this.data_project = pager.getAttribute('data-proj');
      console.log(`project: ${this.data_project}`);
    } else {
      console.log('did not find a data-proj');
    }
    const textPanelInput = splitOutEnums(pager);

    this.middlePanel = "<i class='fas fa-spinner'></i>";
    this.middlePanel = this.sanitizer.bypassSecurityTrustHtml(
      pager.innerHTML
    );

    this.textPanel = "<i class='fas fa-spinner'></i>";
    this.textPanel = this.sanitizer.bypassSecurityTrustHtml(
      textPanelInput.innerHTML
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

        console.log(`Don't want to do this? URL: ${this.router.url}`);
        this.getDataService.setSourceParams(queryParams);
        this.router.navigate([this.router.url], {
          state: { data: history.state.data }
        });
      } else {
        window.open(clickedLink.href);
      }
    }
  }

  private handlePopupDataInputHTMLConversion(text: string) {
    const parser = new DOMParser();
    const htmlData = parser.parseFromString(text, 'text/html');
    const detailsPopupContentInput = htmlData.querySelector('.score_block');
    const detailsPopupTitleInput = htmlData.querySelector('title');

    this.detailsPopupTitle = this.sanitizer.bypassSecurityTrustHtml(
      detailsPopupTitleInput.innerHTML
    );
    this.detailsPopupContent = this.sanitizer.bypassSecurityTrustHtml(
      `<table>${detailsPopupContentInput.innerHTML}<table>`
    );
  }

  public handleDetailsClick(e) {
    e.preventDefault();
    const anchorEl = findAncestorByTag(e.target, 'a');
    const wsig = findAttribute(e.target, 'data-wsig');

// what is this showexemplar thing?...
//      if (anchorEl.href.includes('showexemplar')) {
//        const popupSourceQueryParams = !!anchorEl.attributes[0]
//          ? anchorEl.attributes[0].nodeValue
//              .split('(')
//              .slice(1)
//              .join()
//              .slice(0, -1)
//              .replace(/'/g, '')
//              .split(',')
//          : [];
//        this.getDataService.setSourceParams(popupSourceQueryParams);
//        this.router.navigate([this.router.url]);

    console.log(`proj: ${this.data_project} sig: ${wsig}`);
    this.router.navigate([
      'search-results',
      this.route.snapshot.paramMap.get('word'),
      'occurrences',
      'texts',
      'source',
      anchorEl.innerText
    ], { queryParams: {
      proj: this.route.snapshot.queryParams['proj'],
      ga_lang: this.route.snapshot.queryParams['ga_lang'],
      ga_isid: this.route.snapshot.queryParams['ga_isid'],
      lang: this.route.snapshot.queryParams['lang'],
      isid: this.route.snapshot.queryParams['isid'],
      iref: this.route.snapshot.queryParams['iref'],
      ref: this.route.snapshot.queryParams['ref'],
      bloc: this.route.snapshot.queryParams['bloc'],
      data_proj: this.data_project,
      wsig: wsig
    }});
  }

  public handleDetailsPopupClose() {
    this.isDetailsPopupActive = false;
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
            top: centralPanelLine.offsetTop - 50,
            behavior: 'smooth'
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
