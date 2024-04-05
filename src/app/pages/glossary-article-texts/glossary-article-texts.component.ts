import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { GetDataService } from '../../services/get-data/get-data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HandleBreadcrumbsService } from '../../services/handle-breadcrumbs/handle-breadcrumbs.service';
import { Router } from '@angular/router';
import { composedPath, getBreadcrumbs } from '../../../utils/utils';

@Component({
  selector: 'app-glossary-article-texts',
  templateUrl: './glossary-article-texts.component.html',
  styleUrls: ['../glossary-article/glossary-article.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GlossaryArticleTextsComponent implements OnInit {
  public glossaryContent: any;
  public pathnameArray = window.location.pathname.slice(1).split('/');
  public breadcrumbLink = getBreadcrumbs();

  @ViewChild('glossary', { static: false }) glossaryWraper;
  constructor(
    private getDataService: GetDataService,
    private sanitizer: DomSanitizer,
    private breadcrumbsService: HandleBreadcrumbsService,
    private router: Router
  ) {
    this.breadcrumbsService.setBreadcrumbs(this.breadcrumbLink);
  }

  ngOnInit() {
    this.getSubsequentArticle();
  }

  public getSubsequentArticle() {
    this.getDataService.getSubsequentGlossaryArticleData().subscribe((data) => {
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
        `/search-results/${decodeURI(this.pathnameArray[1])}`,
        'occurrences'
      ]);
    }
  }

  private handleTextToHTMLConversion(text: string) {
    const parser = new DOMParser();
    const htmlData = parser.parseFromString(text, 'text/html');
    const glossaryContentInput = htmlData.getElementsByTagName('body')[0];

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
