import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { routing, appRoutingProviders } from './app.routing';

import { PrototypeModule } from './prototype/prototype.module';
import { DemoModule } from './demo/demo.module';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PaymentComponent } from "./payment/payment.component";
import { DonationComponent } from "./donation/donation.component";

import { ParameterService } from "./services/parameter.service";

@NgModule({
  imports: [
    BrowserModule,
    routing,
    PrototypeModule,
    DemoModule
  ],
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    PaymentComponent,
    DonationComponent
  ],
  providers: [
    appRoutingProviders,
    ParameterService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }