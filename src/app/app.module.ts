import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AgentComponent } from './agent/agent.component';
import { LoginComponent } from './login/login.component';
import { SearchComponent } from './search/search.component';
import { FilterbarComponent } from './search/filterbar/filterbar.component';
import { MapComponent } from './search/map/map.component';
import { ReListingComponent } from './search/re-listing/re-listing.component';

import { AppConfig } from './config/app.config';
import { AppConfigload } from './config/app.configload';
import { FooterComponent } from './footer/footer.component';

import { ReactiveFormsModule } from '@angular/forms';
import { GmapPacComponent } from './gmap-pac/gmap-pac.component';
import { PropDetailsComponent } from './search/prop-details/prop-details.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AgentComponent,
    LoginComponent,
    SearchComponent,
    FilterbarComponent,
    MapComponent,
    ReListingComponent,
    FooterComponent,
    GmapPacComponent,
    PropDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    JsonpModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: AppConfigload,
      deps: [AppConfig],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }