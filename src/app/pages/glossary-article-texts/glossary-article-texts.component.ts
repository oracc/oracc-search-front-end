import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { GetDataService } from '../../services/get-data/get-data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HandleBreadcrumbsService } from '../../services/handle-breadcrumbs/handle-breadcrumbs.service';
import { ActivatedRoute, Router } from '@angular/router';
import { composedPath } from '../../../utils/utils';

@Component({
  selector: 'app-glossary-article-texts',
  templateUrl: './glossary-article-texts.component.html',
  styleUrls: ['../glossary-article/glossary-article.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GlossaryArticleTextsComponent implements OnInit {
  public glossaryContent: any;
  private project: string = 'neo';

  @ViewChild('glossary', { static: false }) glossaryWraper;
  constructor(
    private getDataService: GetDataService,
    private sanitizer: DomSanitizer,
    private breadcrumbsService: HandleBreadcrumbsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
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
      //...

      this.router.navigate(
        [ 'search-results',
          anchorElText,
          'occurrences'
        ],
        { queryParams: {
          proj: this.project,
          ga_lang: this.route.snapshot.queryParams['ga_lang'],
          ga_isid: this.route.snapshot.queryParams['ga_isid'],
          lang: anchorEl.getAttribute('data-lang'),
          isid: anchorEl.getAttribute('data-isid')
        }}
      );
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
