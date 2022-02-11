import { Component, OnInit, ViewChild } from "@angular/core";
import { GetDataService } from "../../services/get-data/get-data.service";
import { DomSanitizer } from "@angular/platform-browser";
import { HandleBreadcrumbsService } from "../../services/handle-breadcrumbs/handle-breadcrumbs.service";
import { Router } from "@angular/router";
import { composedPath } from "../../../utils/utils";

@Component({
  selector: "app-glossary-article-texts",
  templateUrl: "./glossary-article-texts.component.html"
})
export class GlossaryArticleTextsComponent implements OnInit {
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
              this.pathnameArray[this.pathnameArray.length - 4]
            ).replace("-", " "),
            url: decodeURI(
              window.location.pathname.split("/").slice(0, -3).join("/")
            )
          },
          {
            name: decodeURI(
              this.pathnameArray[this.pathnameArray.length - 3]
            ).replace("-", " "),
            url: decodeURI(
              window.location.pathname.split("/").slice(0, -2).join("/")
            )
          },
          {
            name: decodeURI(
              this.pathnameArray[this.pathnameArray.length - 2]
            ).replace("-", " "),
            url: decodeURI(
              window.location.pathname.split("/").slice(0, -1).join("/")
            )
          },
          {
            name: decodeURI(
              this.pathnameArray[this.pathnameArray.length - 1]
            ).replace("-", " "),
            url: decodeURI(window.location.pathname)
          }
        ]
      : [
          {
            name: "Search Results",
            url: "/search-results"
          },
          {
            name: decodeURI(
              this.pathnameArray[this.pathnameArray.length - 4]
            ).replace("-", " "),
            url: decodeURI(
              window.location.pathname.split("/").slice(0, -3).join("/")
            )
          },
          {
            name: decodeURI(
              this.pathnameArray[this.pathnameArray.length - 3]
            ).replace("-", " "),
            url: decodeURI(
              window.location.pathname.split("/").slice(0, -2).join("/")
            )
          },
          {
            name: decodeURI(
              this.pathnameArray[this.pathnameArray.length - 2]
            ).replace("-", " "),
            url: decodeURI(
              window.location.pathname.split("/").slice(0, -1).join("/")
            )
          },
          {
            name: decodeURI(
              this.pathnameArray[this.pathnameArray.length - 1]
            ).replace("-", " "),
            url: decodeURI(window.location.pathname)
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
          return !!el.className ? el.className.match("icount") : "";
        })
      : composedPath(e.target).find((el) => {
          return !!el.className ? el.className.match("icount") : "";
        });

    if (anchorEl) {
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

      this.getDataService.setDetailsPageParams(
        queryParams[0],
        queryParams[1],
        queryParams[2]
      );

      this.getDataService.setChosenTermText(anchorElText);
      if (window.innerWidth > 991) {
        this.router.navigate([
          `/search/search-results/${decodeURI(this.pathnameArray[2])}`,
          "occurrences"
        ]);
      } else {
        this.router.navigate([
          `/search-results/${decodeURI(this.pathnameArray[1])}`,
          "occurrences"
        ]);
      }
    }
  }

  private handleTextToHTMLConversion(text: string) {
    const parser = new DOMParser();
    const htmlData = parser.parseFromString(text, "text/html");
    const glossaryContentInput = htmlData.getElementsByTagName("body")[0];

    if (
      glossaryContentInput.querySelector("p") &&
      (glossaryContentInput
        .querySelector("p")
        .innerText.toLowerCase()
        .match("no such map") ||
        glossaryContentInput
          .querySelector("p")
          .innerText.toLowerCase()
          .match("no html file found"))
    ) {
      this.glossaryContent = `<p class="glossary__fallback">No glossary article found</p>`;
    } else {
      this.glossaryContent = this.sanitizer.bypassSecurityTrustHtml(
        glossaryContentInput.innerHTML
      );
    }
  }
}
