import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { GetDataService } from '../../services/get-data/get-data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HandleBreadcrumbsService } from '../../services/handle-breadcrumbs/handle-breadcrumbs.service';
import { ActivatedRoute, Router } from '@angular/router';
import { findAncestorBy, findAncestorByTag, mergeParams, addArticleParams, addParams } from '../../../utils/utils';

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

  private getDescendant(e, pred) {
    if (!e) {
      return null;
    }
    if (pred(e)) {
      return e;
    }
    const cs = e.children;
    for (let i = 0; i !== cs.length; ++i) {
      let d = this.getDescendant(cs.item(i), pred);
      if (d) {
        return d;
      }
    }
    return null;
  }

  private lexicalAssociationTitleElement(anchorEl: HTMLElement) {
    const grandmother = findAncestorBy(
      anchorEl,
      e => e.classList.contains('lex-phra')
    );
    return this.getDescendant(
      grandmother,
      e => e.hasAttribute('data-isid')
    );
  }

  public handleTermClick(e) {
    const texts = findAncestorBy(
      e.target,
      e => e.hasAttribute('data-isid') && e.hasAttribute('data-lang')
    );
    const ga_proj = this.route.snapshot.queryParams['proj'];
    if (texts) {
      e.preventDefault();
      const isid = texts.getAttribute('data-isid');
      const lang = texts.getAttribute('data-lang');
      const proj = texts.hasAttribute('data-proj')?
        texts.getAttribute('data-proj') : ga_proj;
      let params = {
        proj: proj,
        ga_lang: this.route.snapshot.queryParams['ga_lang'],
        ga_isid: this.route.snapshot.queryParams['ga_isid'],
        lang: lang,
        isid: isid,
      }
      addArticleParams(params);
      let type = texts.getAttribute('data-type');
      if (['period', 'norm', 'forms', 'morphology', 'verbal prefix'].includes(type)) {
        params['type'] = type;
        params['name'] = texts.getAttribute('data-name');
      } else if (texts.hasAttribute('data-sense')) {
        params['name'] = texts.getAttribute('data-sense');
        params['type'] = 'sense';
      }
      if (texts.hasAttribute('data-epos')) {
        params['pos'] = texts.getAttribute('data-epos');
      }
      this.router.navigate(
        ['search-results', this.route.snapshot.paramMap.get('word'), 'occurrences'],
        { queryParams: params }
      );
      return;
    }

    const anchorEl = findAncestorByTag(e.target, 'a');
    if (!anchorEl) {
      return;
    }

    if (anchorEl.hasAttribute('data-iref')) {
      // we go to a different place than neo;
      // neo goes to GlossaryArticleTextsComponent, but for us we would have
      // a lot of missing details that would make breadcrumbs fail.
      // So we navigate to details texts component.
      // But first we need to find at least data-isid and data-lang, which are on
      // an aunt node.
      let params = {
        proj: ga_proj,
      };
      addParams(
        params,
        [anchorEl, this.lexicalAssociationTitleElement(anchorEl)],
        {
          iref: 'data-iref',
          isid: 'data-isid',
          lang: 'data-lang',
          type: 'data-type',
          name: 'data-name',
          proj: 'data-proj',
        }
      )
      const aunt = this.lexicalAssociationTitleElement(anchorEl);
      addArticleParams(params);
      this.router.navigate(
        [ 'search-results',
          this.route.snapshot.paramMap.get('word'),
          'occurrences',
          'texts'
        ],
        { queryParams: mergeParams(
          params,
          this.route.snapshot.queryParams,
          ['ga_lang', 'ga_isid', 'lang', 'isid', 'gw', 'type', 'name', 'pos']
        )}
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
