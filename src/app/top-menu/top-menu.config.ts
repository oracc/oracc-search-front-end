import { Routes } from '@angular/router';
import { HelpComponent } from '../help';

export const routerConfig: Routes = [
    {
        path: 'help',
        component: HelpComponent
    },
    // {
    //     path: '',
    //     redirectTo: '/home',
    //     pathMatch: 'full'
    // },
    // {
    //     path: '**',
    //     redirectTo: '/home',
    //     pathMatch: 'full'
    // }
];
