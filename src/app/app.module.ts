import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgxPaginationModule } from "ngx-pagination";

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { HomeComponent } from "./pages/home/home.component";
import { CookiesComponent } from "./components/cookies/cookies.component";
import { SearchComponent } from "./pages/search/search.component";
import { BreadcrumbsComponent } from "./components/breadcrumbs/breadcrumbs.component";
import { AppRoutingModule } from "./app-routing.module";

import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { SearchResultsComponent } from "./components/search-results/search-results.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "./material/material.module";
import { GetDataService } from "./services/get-data/get-data.service";
import { GlossaryArticleComponent } from "./pages/glossary-article/glossary-article.component";
import { FormsModule } from "@angular/forms";
import { DetailsComponent } from "./pages/details/details.component";
import { BreadcrumbsModule } from "ng6-breadcrumbs";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { SortPipe } from "./pipes/sort.pipe";
import { GlossaryArticleTextsComponent } from "./pages/glossary-article-texts/glossary-article-texts.component";
import { DetailsTextsComponent } from "./pages/details-texts/details-texts.component";
import { DetailsSourceComponent } from "./pages/details-source/details-source.component";
import { GlossaryArticleSourceComponent } from "./pages/glossary-article-source/glossary-article-source.component";
import { PageNotFoundComponent } from "./pages/page-not-found/page-not-found.component";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/");
}

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: false
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    CookiesComponent,
    SearchComponent,
    BreadcrumbsComponent,
    SearchResultsComponent,
    GlossaryArticleComponent,
    DetailsComponent,
    SortPipe,
    GlossaryArticleTextsComponent,
    DetailsTextsComponent,
    DetailsSourceComponent,
    GlossaryArticleSourceComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    MaterialModule,
    NgxPaginationModule,
    BreadcrumbsModule,
    PerfectScrollbarModule
  ],
  providers: [
    GetDataService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
