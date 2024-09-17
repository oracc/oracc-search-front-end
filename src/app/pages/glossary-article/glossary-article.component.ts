import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { GetDataService } from '../../services/get-data/get-data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HandleBreadcrumbsService } from '../../services/handle-breadcrumbs/handle-breadcrumbs.service';
import { ActivatedRoute, Router } from '@angular/router';
import { composedPath } from '../../../utils/utils';

@Component({
  selector: 'app-glossary-article',
  templateUrl: './glossary-article.component.html',
  styleUrls: ['./glossary-article.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GlossaryArticleComponent implements OnInit {
  public glossaryContent: any;

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
    this.getArticle();
  }

  public getArticle() {
    this.getDataService.getGlossaryArticleData(
      this.route.snapshot.queryParams['ga_lang'],
      this.route.snapshot.queryParams['ga_isid']
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

    if (!!anchorEl) {
      e.preventDefault();
      this.router.navigate(
        ['search-results', this.route.snapshot.paramMap.get('word'), 'occurrences'],
        { queryParams: {
          proj: this.route.snapshot.queryParams['proj'],
          ga_lang: this.route.snapshot.queryParams['ga_lang'],
          ga_isid: this.route.snapshot.queryParams['ga_isid'],
          lang: anchorEl.getAttribute('data-lang'),
          isid: anchorEl.getAttribute('data-isid'),
        }}
      );
    }
  }

  private handleTextToHTMLConversion(text: string) {
    const parser = new DOMParser();
    const htmlData = parser.parseFromString(text, 'text/html');
    let glossaryContentInput = htmlData.getElementById('p4Content');
    // Occasionally the server returns just the the content without
    // the surrounding furniture. So if we can't find #p4Content we'll
    // just use the entire <body>
    if (glossaryContentInput === null) {
      glossaryContentInput = htmlData.getElementsByTagName('body')[0];
    }

    this.glossaryContent = this.sanitizer.bypassSecurityTrustHtml(
      glossaryContentInput.innerHTML
    );
  }
}
