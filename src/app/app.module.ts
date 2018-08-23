import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Ng2SearchPipeModule } from 'ng2-search-filter'; //importing the module
import { Ng2OrderModule } from 'ng2-order-pipe'; //importing the module
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

import { DataService } from './data-service';

import { TRANSLATION_PROVIDERS, TranslatePipe, TranslateService }   from './translate';

import { TopMenuComponent, routerConfig } from './top-menu';
import { HomeComponent } from './home';
import { HelpComponent } from './help';
import { SearchTableComponent } from './search-table';
import { LangButtonComponent } from './lang-button/lang-button.component';
import { DisplayTableComponent } from './display-table/display-table.component';


@NgModule({
  declarations: [
    AppComponent, TranslatePipe, TopMenuComponent,
    HomeComponent, HelpComponent, SearchTableComponent, LangButtonComponent, DisplayTableComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    Ng2SearchPipeModule, //including into imports
    Ng2OrderModule, // importing the sorting package here
    NgxPaginationModule,
    RouterModule.forRoot(routerConfig)
  ],
  providers: [DataService, TranslateService, TRANSLATION_PROVIDERS],
  bootstrap: [AppComponent]
})
export class AppModule { }
