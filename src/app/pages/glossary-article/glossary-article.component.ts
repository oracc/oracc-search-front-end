import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { GetDataService } from "../../services/get-data/get-data.service";
import { DomSanitizer } from "@angular/platform-browser";
import { HandleBreadcrumbsService } from "../../services/handle-breadcrumbs/handle-breadcrumbs.service";
import { Router } from "@angular/router";
import { composedPath } from "../../../utils/utils";

@Component({
  selector: "app-glossary-article",
  templateUrl: "./glossary-article.component.html",
  styleUrls: ["./glossary-article.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class GlossaryArticleComponent implements OnInit {
  public glossaryContent: any;
  public pathnameArray = window.location.pathname.slice(1).split("/");
  public breadcrumbLink =
    window.innerWidth > 991
      ? [
          {
            name: "Search",
            url: "/search"
          },
          {
            name: "Search Results",
            url: "/search/search-results"
          },
          {
            name: decodeURI(
              this.pathnameArray[this.pathnameArray.length - 1]
            ).replace("-", " "),
            url: window.location.pathname
          }
        ]
      : [
          {
            name: "Search Results",
            url: "/search-results"
          },
          {
            name: decodeURI(
              this.pathnameArray[this.pathnameArray.length - 1]
            ).replace("-", " "),
            url: window.location.pathname
          }
        ];

  @ViewChild("glossary", { static: false }) glossaryWraper;
  constructor(
    private getDataService: GetDataService,
    private sanitizer: DomSanitizer,
    private breadcrumbsService: HandleBreadcrumbsService,
    private router: Router
  ) {
    this.breadcrumbsService.setBreadcrumbs(this.breadcrumbLink);
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
          return !!el.className ? el.className.match("icount") : "";
        })
      : composedPath(e.target).find((el) => {
          return !!el.className ? el.className.match("icount") : "";
        });

    if (!!anchorEl) {
      const anchorElText = anchorEl.querySelector("span")
        ? anchorEl.querySelector("span").innerText
        : anchorEl.innerText;
      e.preventDefault();
      const queryParams = anchorEl.href
        .split("(")
        .slice(1)
        .join()
        .slice(0, -1)
        .replace(/'/g, "")
        .split(",");
      const filteredText = anchorElText.match("%")
        ? Array.prototype.slice
            .call(anchorEl.parentNode.childNodes)
            .filter((node) => {
              return node.nodeType === 3 ? node : "";
            })[0].textContent
        : anchorElText;

      this.getDataService.setDetailsPageParams(
        queryParams[0],
        queryParams[1],
        queryParams[2]
      );
      this.getDataService.setChosenTermText(filteredText);
      this.router.navigate([decodeURI(this.router.url), "occurrences"]);
    }
  }

  private handleTextToHTMLConversion(text: string) {
    const parser = new DOMParser();
    const htmlData = parser.parseFromString(text, "text/html");
    const glossaryContentInput = htmlData.getElementsByTagName("body")[0];

    this.glossaryContent = this.sanitizer.bypassSecurityTrustHtml(
      glossaryContentInput.innerHTML
    );
  }
}
