import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GetDataService } from '../../services/get-data/get-data.service';
import { HandleBreadcrumbsService } from 'src/app/services/handle-breadcrumbs/handle-breadcrumbs.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { composedPath, findAncestorByTag, findAttribute, splitOutEnums } from '../../../utils/utils';
import { PANEL_TYPE } from '../../../utils/consts';
import { ThreePanel } from 'src/app/components/three-panel.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-details-source',
  templateUrl: './details-source.component.html',
  styleUrls: ['./details-source.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailsSourceComponent extends ThreePanel {
  public isDetailsPopupActive: boolean;
  public detailsPopupContent: any;
  public detailsPopupTitle: any;
  private data_project: string = 'neo';

  override getBackendData(): Observable<string> {
    return this.getDataService.getSourceData(
      this.route.snapshot.queryParams['proj'],
      this.route.snapshot.queryParams['ref'],
      this.route.snapshot.queryParams['bloc']
    );
  }

  override setMiddlePanel(htmlData : Document) {
    const pager = htmlData.getElementById('p4Pager');
    if (pager.hasAttribute('data-proj')) {
      this.data_project = pager.getAttribute('data-proj');
      console.log(`project: ${this.data_project}`);
    } else {
      console.log('did not find a data-proj');
    }
    const textPanelInput = splitOutEnums(pager);

    this.middlePanel = this.sanitizer.bypassSecurityTrustHtml(
      pager.innerHTML
    );

    this.textPanel = this.sanitizer.bypassSecurityTrustHtml(
      textPanelInput.innerHTML
    );
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
