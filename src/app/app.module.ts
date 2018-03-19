import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Ng2SearchPipeModule } from 'ng2-search-filter'; //importing the module
import { Ng2OrderModule } from 'ng2-order-pipe'; //importing the module
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

import { DataService } from './data.service';

import { TRANSLATION_PROVIDERS, TranslatePipe, TranslateService }   from './translate';

import { TopMenuComponent, routerConfig } from './top-menu';
import { HelpComponent } from './help';

@NgModule({
  declarations: [
    AppComponent, TranslatePipe, TopMenuComponent, HelpComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    Ng2SearchPipeModule, //including into imports
    Ng2OrderModule, // importing the sorting package here
    NgxPaginationModule,
    RouterModule.forRoot(routerConfig)
  ],
  providers: [DataService, TranslateService, TRANSLATION_PROVIDERS],
  bootstrap: [AppComponent]
})
export class AppModule { }
