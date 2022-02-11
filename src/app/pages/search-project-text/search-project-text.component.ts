import { Component, OnInit } from "@angular/core";
import { GetDataService } from "../../services/get-data/get-data.service";
import { DomSanitizer } from "@angular/platform-browser";

import { ActivatedRoute, ParamMap } from "@angular/router";

@Component({
  selector: "app-search-project-text",
  templateUrl: "./search-project-text.component.html",
  styleUrls: ["./search-project-text.component.scss"]
})
export class SearchProjectTextComponent implements OnInit {
  public isMobile: boolean;
  public routerLink: string;
  public projectTextContent: any;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private getDataService: GetDataService
  ) {}

  ngOnInit() {
    this.isMobile = window.innerWidth < 991;

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.getArticle(paramMap);
    });
  }

  public getArticle(paramMap: ParamMap) {
    this.getDataService.getProjectTextData(paramMap).subscribe((data) => {
      // @ts-ignore
      this.handleTextToHTMLConversion(data);
    });
  }

  private handleTextToHTMLConversion(text: string) {
    const parser = new DOMParser();
    const htmlData = parser.parseFromString(text, "text/html");
    const projectTextContentInput = htmlData.getElementsByTagName("body")[0];

    this.projectTextContent = this.sanitizer.bypassSecurityTrustHtml(
      projectTextContentInput.innerHTML
    );
  }
}
