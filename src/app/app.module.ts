import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// core
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// pages
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { SearchComponent } from './pages/search/search.component';
import { GlossaryArticleComponent } from './pages/glossary-article/glossary-article.component';
import { DetailsComponent } from './pages/details/details.component';
import { GlossaryArticleTextsComponent } from './pages/glossary-article-texts/glossary-article-texts.component';
import { DetailsTextsComponent } from './pages/details-texts/details-texts.component';
import { DetailsScoreComponent } from './pages/details-score/details-score.component';
import { GlossaryArticleScoreComponent } from './pages/glossary-article-score/glossary-article-score.component';
import { ProjectTextComponent } from './pages/details-texts/project-text.component';

// components
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CookiesComponent } from './components/cookies/cookies.component';
import { SearchSuggestionsComponent } from './components/search-suggestions/search-suggestions.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';

// services
import { GetDataService } from './services/get-data/get-data.service';

// pipes
import { SortPipe } from './pipes/sort.pipe';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/');
}

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    SearchSuggestionsComponent,
    SearchResultsComponent,
    GlossaryArticleComponent,
    DetailsComponent,
    GlossaryArticleTextsComponent,
    DetailsTextsComponent,
    DetailsScoreComponent,
    GlossaryArticleScoreComponent,
    ProjectTextComponent,
    PageNotFoundComponent,
    HeaderComponent,
    FooterComponent,
    CookiesComponent,
    BreadcrumbsComponent,
    SortPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    FormsModule,
    NgxPaginationModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [GetDataService],
  bootstrap: [AppComponent]
})
export class AppModule {}
