import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { SearchComponent } from "./pages/search/search.component";
import { SearchResultsComponent } from "./components/search-results/search-results.component";
import { GlossaryArticleComponent } from "./pages/glossary-article/glossary-article.component";
import { GlossaryArticleTextsComponent } from "./pages/glossary-article-texts/glossary-article-texts.component";
import { DetailsComponent } from "./pages/details/details.component";
import { DetailsTextsComponent } from "./pages/details-texts/details-texts.component";
import { DetailsSourceComponent } from "./pages/details-source/details-source.component";
import { GlossaryArticleSourceComponent } from "./pages/glossary-article-source/glossary-article-source.component";
import { PageNotFoundComponent } from "./pages/page-not-found/page-not-found.component";

// duplicated routes are to handle both desktop and mobile versions
const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },

  // routes for desktop
  {
    path: "search",
    component: SearchComponent,
    children: [
      {
        path: "search-results",
        component: SearchResultsComponent
      },
      {
        path: "search-results/:id:breadcrumb",
        component: GlossaryArticleComponent
      },
      {
        path: "search-results/:id:breadcrumb/occurrences",
        component: DetailsComponent
      },
      {
        path: "search-results/:id:breadcrumb/occurrences/texts",
        component: DetailsTextsComponent
      },
      {
        path: "search-results/:id:breadcrumb/occurrences/texts/source",
        component: DetailsSourceComponent
      },
      {
        path: "search-results/:id:breadcrumb/occurrences/texts/:id:breadcrumb",
        component: GlossaryArticleTextsComponent
      },
      {
        path: "search-results/:id:breadcrumb/occurrences/texts/source/:id:breadcrumb",
        component: GlossaryArticleSourceComponent
      }
    ]
  },

  // routes for mobile
  {
    path: "search-results",
    component: SearchResultsComponent
  },
  {
    path: "search-results/:id:breadcrumb",
    component: GlossaryArticleComponent
  },
  {
    path: "search-results/:id:breadcrumb/occurrences",
    component: DetailsComponent
  },
  {
    path: "search-results/:id:breadcrumb/occurrences/texts",
    component: DetailsTextsComponent
  },
  {
    path: "search-results/:id:breadcrumb/occurrences/texts/source",
    component: DetailsSourceComponent
  },
  {
    path: "search-results/:id:breadcrumb/occurrences/texts/:id:breadcrumb",
    component: GlossaryArticleTextsComponent
  },
  {
    path: "search-results/:id:breadcrumb/occurrences/texts/source/:id:breadcrumb",
    component: GlossaryArticleSourceComponent
  },

  // routes for manually entereded URL's
  {
    path: ":projectId/:textId",
    component: DetailsTextsComponent
  },
  {
    path: ":projectId/:subprojectId/:textId",
    component: DetailsTextsComponent
  },

  // fallback routes
  { path: "404", component: PageNotFoundComponent },
  { path: "**", redirectTo: "404" }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: "reload"
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
