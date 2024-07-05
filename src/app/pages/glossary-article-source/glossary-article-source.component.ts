import { Component, OnInit, ViewChild } from '@angular/core';
import { GetDataService } from '../../services/get-data/get-data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HandleBreadcrumbsService } from '../../services/handle-breadcrumbs/handle-breadcrumbs.service';
import { ActivatedRoute, Router } from '@angular/router';
import { composedPath, findAttribute } from '../../../utils/utils';

@Component({
  selector: 'app-glossary-article-source',
  templateUrl: './glossary-article-source.component.html'
})
export class GlossaryArticleSourceComponent implements OnInit {
  public glossaryContent: any;
  private pathnameArray: Array<string>;
  private project: string = 'neo';

  @ViewChild('glossary', { static: false }) glossaryWraper;
  constructor(
    private getDataService: GetDataService,
    private sanitizer: DomSanitizer,
    private breadcrumbsService: HandleBreadcrumbsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.pathnameArray = this.router.url.split('/').filter(v => v != '');
    this.breadcrumbsService.setBreadcrumbs(this.router);
  }

  ngOnInit() {
    const proj = this.route.snapshot.queryParams['proj'];
    if (proj) {
      this.project = proj;
    }
    this.getSubsequentArticle();
  }

  public getSubsequentArticle() {
    console.log(`getSubsequentArticle ${this.project} ${this.route.snapshot.queryParams['wsig']}`);
    this.getDataService.getSubsequentGlossaryArticleData(
      this.project,
      this.route.snapshot.queryParams['wsig']
    ).subscribe((data) => {
      // @ts-ignore
      this.handleTextToHTMLConversion(data);
    });
  }

  public handleTermClick(e) {
    const anchorEl = e.path
      ? e.path.find((el) => {
          return !!el.className ? el.className.match('icount') : '';
        })
      : composedPath(e.target).find((el) => {
          return !!el.className ? el.className.match('icount') : '';
        });
    if (anchorEl) {
      const anchorElText = anchorEl.querySelector('span')
        ? anchorEl.querySelector('span').innerText
        : anchorEl.innerText;
      e.preventDefault();
      const queryParams = anchorEl.href
        .split('(')
        .slice(1)
        .join()
        .slice(0, -1)
        .replace(/'/g, '')
        .split(',');

      this.getDataService.setDetailsPageParams(
        queryParams[0],
        queryParams[1],
        queryParams[2]
      );

      this.getDataService.setChosenTermText(anchorElText);
      this.router.navigate([
        'search-results',
        anchorElText,
        'occurrences'
      ], { queryParams: {
        lang: findAttribute(anchorEl, 'data-lang'),
        isid: findAttribute(anchorEl, 'data-isid'),
        proj: this.project
      }});
    }
  }

  private handleTextToHTMLConversion(text: string) {
    const parser = new DOMParser();
    const htmlData = parser.parseFromString(text, 'text/html');
    const glossaryContentInput = htmlData.getElementsByTagName('body')[0];

    const pager = htmlData.getElementById('p4Pager');
    if (pager && pager.hasAttribute('data-proj')) {
      this.project = pager.getAttribute('data-proj');
      console.log(`glossary-article-source project ${this.project}`);
    }
    if (
      glossaryContentInput.querySelector('p') &&
      (glossaryContentInput
        .querySelector('p')
        .innerText.toLowerCase()
        .match('no such map') ||
        glossaryContentInput
          .querySelector('p')
          .innerText.toLowerCase()
          .match('no html file found'))
    ) {
      this.glossaryContent = `<p class="glossary__fallback">No glossary article found</p>`;
    } else {
      this.glossaryContent = this.sanitizer.bypassSecurityTrustHtml(
        glossaryContentInput.innerHTML
      );
    }
  }
}
