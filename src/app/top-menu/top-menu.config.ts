import { Routes } from '@angular/router';
import { HomeComponent } from '../home';
import { HelpComponent } from '../help';
import { DisplayTableComponent } from '../display-table';
import { SearchTableComponent } from '../search-table';

export const routerConfig: Routes = [
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'help',
        component: HelpComponent
    },
    {
        path: 'search',
        component: DisplayTableComponent
    },
    {
        path: 'list-all',
        component: SearchTableComponent
    },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    // {
    //     path: '**',
    //     redirectTo: '/home',
    //     pathMatch: 'full'
    // }
];
