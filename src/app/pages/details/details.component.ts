import { Component, ViewEncapsulation } from '@angular/core';
import { composedPath } from '../../../utils/utils';
import { ThreePanel } from 'src/app/components/three-panel.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailsComponent extends ThreePanel {
  override setMiddlePanel(htmlData : Document) {
    const middlePanelInput = htmlData.getElementById('p4Content');

    this.middlePanel = this.sanitizer.bypassSecurityTrustHtml(
      middlePanelInput.innerHTML
    );
    this.setTextPanel(htmlData);
  }

  override setMetadataPanel(htmlData: Document) {
    const metadataPanelInput = htmlData.getElementById('p4MenuOutline');
    this.metadataPanel = this.sanitizer.bypassSecurityTrustHtml(
      metadataPanelInput.innerHTML
    );
  }

  override detailsPanelTopText(): string {
    return "details.linesText";
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
          iref: ref,
        }}
      );
    }
  }

  public handleMetadataClick(e) {
    e.preventDefault();
    if (e.target.tagName === "A" && e.target.hasAttribute('data-zoom')) {
      this.setZoom(parseInt(e.target.getAttribute('data-zoom'), 10));
    }
  }
}
