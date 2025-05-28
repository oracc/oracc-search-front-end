import {
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { composedPath } from '../../../utils/utils';
import { ThreePanel } from 'src/app/components/three-panel.component';
import { mergeParams } from '../../../utils/utils';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailsComponent extends ThreePanel {

  override setMiddlePanel(htmlData: Document) {
    const middlePanelInput = htmlData.getElementById('p4Content');

    this.middlePanel = this.sanitizer.bypassSecurityTrustHtml(
      middlePanelInput.innerHTML
    );
    this.setTextPanel(htmlData);

    setTimeout(() => {
      this.scrollToSelected();
    });
  }

  override setMetadataPanel(htmlData: Document) {
    const metadataPanelInput = htmlData.getElementById('p4MenuOutline');
    this.metadataPanel = this.sanitizer.bypassSecurityTrustHtml(
      metadataPanelInput.innerHTML
    );
  }

  override detailsPanelTopText(): string {
    return 'details.linesText';
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

    const iref = anchorEl.getAttribute('data-iref');
    const proj = anchorEl.hasAttribute('data-proj')
      ? anchorEl.getAttribute('data-proj')
      : this.project;

    if (iref) {
      // navigates to details texts component
      this.router.navigate(
        ['search-results', this.chosenTermText, 'occurrences', 'texts'],
        {
          queryParams: mergeParams(
            {
              proj: proj,
              iref: iref
            },
            this.route.snapshot.queryParams,
            ['ga_lang', 'ga_isid', 'lang', 'isid', 'gw', 'type', 'name', 'pos']
          )
        }
      );
    }
    this.scrollToSelected();
  }

  public handleMetadataClick(e) {
    e.preventDefault();
    if (e.target.tagName === 'A' && e.target.hasAttribute('data-zoom')) {
      this.setZoom(parseInt(e.target.getAttribute('data-zoom'), 10));
    }
  }

  private scrollToSelected(): void {
    console.log('scrolling to selected');
    // Being doubly sure the element should be rendered, might not need the timeout
    let container = document.querySelector('.transliteration');
    console.log("container: ", container, document.querySelector('.selected'));
    let selectedElement = container?.querySelector('.selected');
    if (selectedElement) {
      console.log("selected elem: ", selectedElement);
      selectedElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
}
