import { Routes } from '@angular/router';
import { HomeComponent } from '../home';
import { HelpComponent } from '../help';
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
