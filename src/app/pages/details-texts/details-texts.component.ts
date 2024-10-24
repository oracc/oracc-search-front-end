import { Component, ViewEncapsulation } from '@angular/core';

import { Observable } from 'rxjs';

import {
  composedPath,
  splitOutTranslations,
  findAttribute,
  findAttributeOnTag,
  findAttributeBy,
  findAncestorByTag
} from '../../../utils/utils';
import { environment } from 'src/environments/environment';
import { ThreePanel } from 'src/app/components/three-panel.component';

@Component({
  selector: 'app-details-texts',
  templateUrl: '../details/details.component.html',
  styleUrls: ['../details/details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailsTextsComponent extends ThreePanel {
  private item: string = '';

  override getBackendData(): Observable<string> {
    return this.getDataService.getDetailData(
      this.project,
      this.route.snapshot.queryParams['lang'],
      this.route.snapshot.queryParams['isid'],
      {ref: this.route.snapshot.queryParams['iref']}
    );
  }

  override detailsPanelTopText(): string {
    return "details.textText";
  }

  override setMetadataPanel(htmlData: Document) {
    const metadataInput = htmlData.getElementById('p4XtfMeta');
    const outlineInput = htmlData.getElementById('p4MenuOutline');
    let m = document.createElement('div');
    m.append(metadataInput, outlineInput);
    this.metadataPanel = this.sanitizer.bypassSecurityTrustHtml(m.innerHTML);
  }

  override setMiddlePanel(htmlData : Document) {
    const pager: HTMLElement = htmlData.getElementById('p4Pager');
    this.item = pager.getAttribute('data-item');
    this.handleTextToHTMLConversionText(htmlData, 'p4XtfData');
  }

  private handleTextToHTMLConversionText(htmlData: Document, middleId: string) {
    const middlePanelInput = htmlData.getElementById(middleId);
    // Add touch control to footnotes
    const noteMarkers = middlePanelInput.getElementsByClassName("marker");
    for (let i = 0; i !== noteMarkers.length; ++i) {
      const marker = noteMarkers.item(i);
      const code = findAttribute(marker, "onmouseover");
      if (code) {
        marker.setAttribute("ontouchstart", code);
      }
    }
    const textPanelInput = splitOutTranslations(middlePanelInput);
    this.middlePanel = this.sanitizer.bypassSecurityTrustHtml(
      middlePanelInput.innerHTML
    );
    this.textPanel = this.sanitizer.bypassSecurityTrustHtml(
      textPanelInput.innerHTML
    );
  }

  public handleDetailsClick(e) {
    e.preventDefault();
    const anchorEl = findAncestorByTag(e.target, 'a');
    if (!anchorEl) {
      // Are we in the <h1> tag containing an external link to the text source?
      if (findAncestorByTag(e.target, 'h1')) {
        const els = e.target.getElementsByTagName('a');
        if (els.length != 0) {
          window.open(els[0].getAttribute('href'), '_blank');
        }
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
          'score'
        ], {
          queryParams: {
            proj: this.project,
            ga_lang: this.route.snapshot.queryParams['ga_lang'],
            ga_isid: this.route.snapshot.queryParams['ga_isid'],
            lang: this.route.snapshot.queryParams['lang'],
            isid: this.route.snapshot.queryParams['isid'],
            iref: this.route.snapshot.queryParams['iref'],
            ref: ref,
            bloc: bloc
          }
        });
      }
      console.log("Cannot find associated TR element for this data-bloc attribute");
      return;
    }
    const wsig = anchorEl.getAttribute('data-wsig');
    const ref = findAttributeBy(e.target, 'id', (el) => el.classList.contains('w'));

    if (this.route.snapshot.paramMap.get('projectId') !== null) {
      // set the navigation link manually when searching for project text id's in the url bar
      // slightly different routes are used for desktop and mobile
      // need to test this, I doubt it works...
      //...
      let url = '/search-results/id/occurrences/texts';

      this.router.navigate([url, anchorEl.innerText]);
      return;
    }

    if (wsig && ref) {
      this.router.navigate([
        'search-results',
        this.chosenTermText,
        'occurrences',
        'texts',
        anchorEl.innerText
      ],{
        queryParams: {
          proj: this.project,
          ga_lang: this.route.snapshot.queryParams['ga_lang'],
          ga_isid: this.route.snapshot.queryParams['ga_isid'],
          lang: this.route.snapshot.queryParams['lang'],
          isid: this.route.snapshot.queryParams['isid'],
          iref: this.route.snapshot.queryParams['iref'],
          ref: ref,
          wsig: wsig
      }});
      return;
    }
  }

  public handleMetadataClick(e) {
    e.preventDefault();
    const clickedLink = findAncestorByTag(e.target, 'a');
    if (!clickedLink) {
      return;
    }
    const zoom = clickedLink.getAttribute('data-zoom');
    if (zoom) {
      this.getDataService.getDetailData(
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
      return;
    }
    const onclick = clickedLink.getAttribute('onclick');
    if (onclick && onclick.startsWith('act_score(')) {
      // neo opens a popup
      window.open(`${environment.glossaryArticleURL}/${this.project}/${this.item}?score`);
      return;
    }
    if (onclick && onclick.startsWith('act_sources(')) {
      window.open(`${environment.glossaryArticleURL}/${this.project}/${this.item}?sources`);
      return;
    }
    window.open(clickedLink.getAttribute('href'));
  }

  override handleTextClick(e) {
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
  override changeText(item: string) {
    this.router.navigate(
      [ 'search-results',
        this.chosenTermText,
        'occurrences',
        'texts'
      ],
      { queryParams: {
        proj: this.project,
        ga_lang: this.route.snapshot.queryParams['ga_lang'],
        ga_isid: this.route.snapshot.queryParams['ga_isid'],
        lang: this.route.snapshot.queryParams['lang'],
        isid: this.route.snapshot.queryParams['isid'],
        iref: item,
      }}
    );
  }
}
