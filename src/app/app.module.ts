import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { routing, appRoutingProviders } from './app.routing';
import { PrototypeModule } from './prototype/prototype.module';
import { DemoModule } from './demo/demo.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  imports: [
    BrowserModule,
    routing,
    PrototypeModule,
    DemoModule
  ],
  declarations: [ AppComponent, PageNotFoundComponent ],
  providers: [ appRoutingProviders ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }