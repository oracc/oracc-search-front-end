import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { composedPath, findAncestorByTag, findAttribute, splitOutEnums } from '../../../utils/utils';
import { ThreePanel } from 'src/app/components/three-panel.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-details-score',
  templateUrl: './details-score.component.html',
  styleUrls: ['./details-score.component.scss', '../details/details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailsScoreComponent extends ThreePanel {
  public isDetailsPopupActive: boolean;
  public detailsPopupContent: any;
  public detailsPopupTitle: any;
  private data_project: string = 'neo';

  override getBackendData(): Observable<string> {
    return this.getDataService.getScoreData(
      this.route.snapshot.queryParams['proj'],
      this.route.snapshot.queryParams['ref'],
      this.route.snapshot.queryParams['bloc']
    );
  }

  override setMiddlePanel(htmlData : Document) {
    const pager = htmlData.getElementById('p4Pager');
    if (pager.hasAttribute('data-proj')) {
      this.data_project = pager.getAttribute('data-proj');
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
      'score',
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

  public handleTextClick(e) {
    if (e.target.hasAttribute('data-iref')) {
      this.router.navigate([
        'search-results',
        this.route.snapshot.paramMap.get('word'),
        'occurrences',
        'texts',
        'score',
        'project'
        ], { queryParams: {
        proj: this.route.snapshot.queryParams['proj'],
        ga_lang: this.route.snapshot.queryParams['ga_lang'],
        ga_isid: this.route.snapshot.queryParams['ga_isid'],
        lang: this.route.snapshot.queryParams['lang'],
        isid: this.route.snapshot.queryParams['isid'],
        iref: this.route.snapshot.queryParams['iref'],
        ref: this.route.snapshot.queryParams['ref'],
        bloc: this.route.snapshot.queryParams['bloc'],
        project_id: this.data_project,
        text_id: e.target.getAttribute('data-iref')
      }})
    }
  }
}
