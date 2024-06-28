import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { GetDataService } from '../../services/get-data/get-data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HandleBreadcrumbsService } from '../../services/handle-breadcrumbs/handle-breadcrumbs.service';
import { ActivatedRoute, Router } from '@angular/router';
import { composedPath, getBreadcrumbs } from '../../../utils/utils';

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
    this.getDataService.getGlossaryArticleData().subscribe((data) => {
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
      this.router.navigate(
        ['search-results', this.route.snapshot.paramMap.get('word'), 'occurrences'],
        { queryParams: {
          lang: anchorEl.getAttribute('data-lang'),
          isid: anchorEl.getAttribute('data-isid'),
        }}
      );
    }
  }

  private handleTextToHTMLConversion(text: string) {
    const parser = new DOMParser();
    const htmlData = parser.parseFromString(text, 'text/html');
    const glossaryContentInput = htmlData.getElementById('p4Content');

    this.glossaryContent = this.sanitizer.bypassSecurityTrustHtml(
      glossaryContentInput.innerHTML
    );
  }
}
