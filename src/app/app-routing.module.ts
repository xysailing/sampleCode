import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AgentComponent } from './agent/agent.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SearchComponent } from './search/search.component';
import { MapComponent } from './search/map/map.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'agent',
        component: AgentComponent
    },
    {
        path: 'agent',
        redirectTo: '/agent',
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'login',
        redirectTo: '/login'
    },
    {
        path: 'search',
        component: SearchComponent
    },
    {
        path: '**',
        redirectTo: '/home',
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }