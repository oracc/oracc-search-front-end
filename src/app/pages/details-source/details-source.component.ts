import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GetDataService } from '../../services/get-data/get-data.service';
import { HandleBreadcrumbsService } from 'src/app/services/handle-breadcrumbs/handle-breadcrumbs.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { composedPath, getBreadcrumbs } from '../../../utils/utils';
import { PANEL_TYPE, SESSION_KEYS } from '../../../utils/consts';

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
    this.metadataPanel = this.sanitizer.bypassSecurityTrustHtml(
      sessionStorage.getItem(SESSION_KEYS.METADATA_CONTENT)
    );
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.getDataService.getSourceData().subscribe((data: any) => {
          this.handleTextToHTMLConversion(data);
        });
      }
    });
  }

  ngOnInit() {
    this.getDataService.getSourceData().subscribe((data: any) => {
      this.handleTextToHTMLConversion(data);
    });
    this.isMobile = window.innerWidth < 991 ? true : false;
  }

  private handleTextToHTMLConversion(text: string) {
    const parser = new DOMParser();
    const htmlData = parser.parseFromString(text, 'text/html');
    const htmlDataToBeReduced = parser.parseFromString(text, 'text/html');
    const middlePanelInput = htmlData.querySelector('.text');
    const textPanelInput = htmlDataToBeReduced.querySelector('.text');

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

    this.middlePanel = "<i class='fas fa-spinner'></i>";
    this.middlePanel = this.sanitizer.bypassSecurityTrustHtml(
      middlePanelInput.innerHTML
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

        this.getDataService.setSourceParams(queryParams);
        this.router.navigate([this.router.url]);
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
      const popupDataQueryParams = !!anchorEl.attributes[2]
        ? anchorEl.attributes[2].nodeValue
            .split('(')
            .slice(1)
            .join()
            .slice(0, -1)
            .replace(/'/g, '')
            .split(',')
        : [];

      if (anchorEl.href.includes('showexemplar')) {
        const popupSourceQueryParams = !!anchorEl.attributes[0]
          ? anchorEl.attributes[0].nodeValue
              .split('(')
              .slice(1)
              .join()
              .slice(0, -1)
              .replace(/'/g, '')
              .split(',')
          : [];

        this.getDataService.setSourceParams(popupSourceQueryParams);
        this.router.navigate([this.router.url]);
      } else {
        if (!!anchorElWrapper) {
          const pureQueryParam = `${
            queryParams[queryParams.length - 1].split('=')[0]
          }=${anchorElWrapper.title}`;

          this.router.navigate(
            [decodeURI(this.router.url), anchorEl.innerText]
          );
          this.getDataService.setSubsequentGlossaryArticleParam(pureQueryParam);
        } else if (!!anchorEl.href) {
          this.isDetailsPopupActive = true;
          this.getDataService
            .getPopupData(
              popupDataQueryParams[0],
              popupDataQueryParams[1],
              popupDataQueryParams[2]
            )
            .subscribe((data: any) => {
              this.handlePopupDataInputHTMLConversion(data);
            });
        }
      }
    }
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
