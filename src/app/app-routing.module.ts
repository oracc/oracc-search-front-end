import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './pages/search/search.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { GlossaryArticleComponent } from './pages/glossary-article/glossary-article.component';
import { GlossaryArticleTextsComponent } from './pages/glossary-article-texts/glossary-article-texts.component';
import { DetailsComponent } from './pages/details/details.component';
import { DetailsTextsComponent } from './pages/details-texts/details-texts.component';
import { DetailsScoreComponent } from './pages/details-score/details-score.component';
import { GlossaryArticleScoreComponent } from './pages/glossary-article-score/glossary-article-score.component';
import { ProjectTextComponent } from './pages/details-texts/project-text.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

// duplicated routes are to handle both desktop and mobile versions
const routes: Routes = [
  {
    path: '',
    component: SearchComponent,
    children: [
      {
        path: 'search-results',
        component: SearchResultsComponent
      },
      {
        path: 'search-results/:word',
        // with query parameters proj, ga_lang, ga_isid
        component: GlossaryArticleComponent
        // contains links to DetailsComponent
      },
      {
        path: 'search-results/:word/occurrences',
        // adding lang, isid
        component: DetailsComponent
        // contains links to DetailsTextsComponent
      },
      {
        path: 'search-results/:word/occurrences/texts',
        // adding iref
        component: DetailsTextsComponent
        // contains links to DetailsScoreComponent
        // and GlossaryArticleTextsComponent
      },
      {
        path: 'search-results/:word/occurrences/texts/score',
        // adding ref, bloc
        component: DetailsScoreComponent
        // contains links to GlossaryArticleScoreComponent and ProjectTextComponent
      },
      {
        path: 'search-results/:word/occurrences/texts/:sig',
        // adding data_proj, wsig
        component: GlossaryArticleTextsComponent
        // contains links back to DetailsComponent
      },
      {
        path: 'search-results/:word/occurrences/texts/score/project',
        // adding project_id and text_id
        component: ProjectTextComponent
      },
      {
        path: 'search-results/:word/occurrences/texts/score/:sig',
        // adding data_proj, wsig
        component: GlossaryArticleScoreComponent
      }
    ]
  },

  // fallback routes
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
