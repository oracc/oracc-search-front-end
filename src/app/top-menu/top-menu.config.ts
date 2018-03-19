import { Routes } from '@angular/router';
import { HelpComponent } from '../help';
import { SearchTableComponent } from '../search-table';

export const routerConfig: Routes = [
    {
        path: 'help',
        component: HelpComponent
    },
    {
        path: 'search',
        component: SearchTableComponent
    }
    {
        path: '',
        redirectTo: '/search',
        pathMatch: 'full'
    },
    // {
    //     path: '**',
    //     redirectTo: '/home',
    //     pathMatch: 'full'
    // }
];
