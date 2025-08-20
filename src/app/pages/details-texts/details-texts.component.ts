import { Component, ViewEncapsulation } from '@angular/core';

import { Observable } from 'rxjs';

import {
  composedPath,
  splitOutTranslations,
  findAttribute,
  findAttributeOnTag,
  findAttributeBy,
  findAncestorByTag,
  mergeParams,
} from '../../../utils/utils';
import { environment } from 'src/environments/environment';
import { ThreePanel } from 'src/app/components/three-panel.component';

@Component({
    selector: 'app-details-texts',
    templateUrl: '../../components/three-panel.component.html',
    styleUrls: ['../../components/three-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class DetailsTextsComponent extends ThreePanel {
  private item: string = '';
  private ref: string;
  private matchScrollTimer: NodeJS.Timeout;
  private tlitIndex = 0;
  private tlatIndex = 0;

  override initialize() {
    this.ref = this.route.snapshot.queryParams['iref'];
  }

  override getBackendData(): Observable<string> {
    return this.getDataService.getDetailData(
      this.project,
      this.route.snapshot.queryParams['lang'],
      this.route.snapshot.queryParams['isid'],
      { ref: this.ref }
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

  override handleDetailsClick(e) {
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
          queryParams: mergeParams(
            {
              proj: this.project,
              ref: ref,
              bloc: bloc
            },
            this.route.snapshot.queryParams,
            ['ga_lang', 'ga_isid', 'lang', 'isid', 'iref', 'gw', 'type', 'name', 'pos']
          )
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
        queryParams: mergeParams(
          {
            proj: this.project,
            ref: ref,
            wsig: wsig
          },
          this.route.snapshot.queryParams,
          ['ga_lang', 'ga_isid', 'lang', 'isid', 'iref', 'gw', 'type', 'name', 'pos']
        )
      });
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
    let href = clickedLink.getAttribute('href');
    const r = RegExp("javascript:viewsBuyBook\\([\"'](.*)[\"']\\)").exec(href);
    if (r) {
      href = r[1];
    }
    window.open(href);
  }

  override handleDetailsScroll(e) {
    // Debounce scroll
    if (this.matchScrollTimer) {
      clearTimeout(this.matchScrollTimer);
    }
    // we need a timeout function that doesn't use "this"
    const that = this;
    function doScroll() {
      that.scrollTranslationToMatchTransliteration();
    }
    this.matchScrollTimer = setTimeout(doScroll, 500);
  }

  override handleTextScroll(e) {
    // Debounce scroll
    if (this.matchScrollTimer) {
      clearTimeout(this.matchScrollTimer);
    }
    // we need a timeout function that doesn't use "this"
    const that = this;
    function doScroll() {
      that.scrollTransliterationToMatchTranslation();
    }
    this.matchScrollTimer = setTimeout(doScroll, 500);
  }

  private totalOffset(from: HTMLElement, toAncestor: Element): number {
    let pe = from.offsetParent;
    let offset = 0;
    while (pe != toAncestor) {
      const he = pe as HTMLElement;
      if (he === null) {
        return 0;
      }
      offset += he.offsetTop;
      pe = he.offsetParent;
    }
    return offset;
  }

  private getNewIndex(
    elementList: NodeListOf<HTMLElement>,
    currentIndex: number,
    panel: HTMLElement,
  ): number | null {
    if (elementList.length == 0) {
      return null;
    }
    const topY = panel.scrollTop - this.totalOffset(elementList.item(0), panel);
    const bottomY = topY + panel.offsetHeight;
    // Let's binary chop elts to find the range within the panel
    let start = 0;
    let end = elementList.length
    // Find the first element with a top within the panel
    while (start != end) {
      const mid = Math.floor(start + (end - start) / 2);
      if (elementList.item(mid).offsetTop < topY) {
        start = mid + 1;
      } else {
        end = mid;
      }
    }
    let belowTop = end;
    start = belowTop;
    end = elementList.length;
    // Find the last element with the bottom within the panel
    while (start != end) {
      const mid = Math.floor(start + (end - start) / 2);
      const midElt = elementList.item(mid);
      if (midElt.offsetTop + midElt.offsetHeight <= bottomY) {
        start = mid + 1;
      } else {
        end = mid;
      }
    }
    let aboveBottom = Math.max(end - 1, 0);
    if (currentIndex < belowTop) {
      // we are going down
      return aboveBottom;
    } else if (aboveBottom < currentIndex) {
      // we are going up
      return belowTop;
    }
    return null
  }

  private scrollPanelTo(scrollPanelId: string, elementToView: HTMLElement) {
    const targetPanel = document.getElementById(scrollPanelId);
    const panelOffset = this.totalOffset(elementToView, targetPanel);
    const bottom = elementToView.offsetTop + elementToView.offsetHeight;
    const panelTop = targetPanel.scrollTop - panelOffset;
    const panelHeight = targetPanel.offsetHeight;
    const panelBottom = panelTop + panelHeight;
    if (elementToView.offsetTop < panelTop && bottom < panelBottom) {
      targetPanel.scrollTo({
        top: elementToView.offsetTop + panelOffset,
        behavior: "smooth",
      });
    } else if (panelTop < elementToView.offsetTop && panelBottom < bottom) {
      targetPanel.scrollTo({
        top: bottom - panelHeight + panelOffset,
        behavior: "smooth",
      });
    }
  }

  private scrollTranslationToMatchTransliteration() {
    const panel = document.getElementById("central-panel");
    const elts = panel.querySelectorAll<HTMLElement>("tr[data-tlat-ref]")
    const tlitIndex = this.getNewIndex(
      elts,
      this.tlitIndex,
      panel,
    );
    if (tlitIndex === null) {
      return;
    }
    const id = elts.item(tlitIndex).getAttribute("data-tlat-ref");
    const target =document.getElementById(id);
    const tr = findAncestorByTag(target, "tr");
    if (tr === null) {
      return;
    }
    this.scrollPanelTo("right-panel", target);
    document.querySelectorAll("#right-panel tr[data-tlit-id]").forEach((e, index) => {
      if (e === tr) {
        this.tlatIndex = index;
        e.classList.add("selected");
      } else {
        e.classList.remove("selected");
      }
    })
    elts.forEach((e, index) => {
      if (index === tlitIndex) {
        e.classList.add("selected");
      } else {
        e.classList.remove("selected");
      }
    });
    this.tlitIndex = tlitIndex;
  }

  private scrollTransliterationToMatchTranslation() {
    const panel = document.getElementById("right-panel");
    const elts = panel.querySelectorAll<HTMLElement>("td[data-tlit-id]")
    const tlatIndex = this.getNewIndex(
      elts,
      this.tlatIndex,
      panel,
    );
    if (tlatIndex === null) {
      return;
    }
    this.selectTlatAndAssociatedTlit(elts, elts.item(tlatIndex));
  }

  // elts is a list of TDs
  // tdToSelect is the one of the TDs to select
  private selectTlatAndAssociatedTlit(
    tlats: NodeListOf<HTMLElement>,
    tdToSelect: HTMLElement,
  ): HTMLElement | null {
    const id = tdToSelect.getAttribute("data-tlit-id");
    const target =document.getElementById(id);
    if (target === null) {
      return null;
    }
    this.scrollPanelTo("central-panel", target);
    document.querySelectorAll("#central-panel tr[data-tlat-ref]").forEach((e, index) => {
      if (e === target) {
        this.tlitIndex = index;
        e.classList.add("selected");
      } else {
        e.classList.remove("selected");
      }
    })
    tlats.forEach((td, index) => {
      const e = findAncestorByTag(td, "tr");
      if (td === tdToSelect) {
        this.tlatIndex = index;
        e.classList.add("selected");
      } else {
        e.classList.remove("selected");
      }
    });
    return target;
  }

  override handleTextClick(e: Event) {
    const clickedLine = findAncestorByTag(e.target  as HTMLElement, "tr");
    const clickedTd = clickedLine.querySelector("td[data-tlit-id]") as HTMLElement;
    if (clickedLine) {
      const elts = document.querySelectorAll<HTMLElement>("#right-panel td[data-tlit-id]");
      const tlit = this.selectTlatAndAssociatedTlit(elts, clickedTd);
      if (tlit) {
        tlit.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        })
      }
    }
  }

  override changeText(item: string) {
    this.ref = item;
    this.setup();
  }
}
