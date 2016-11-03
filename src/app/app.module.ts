import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { AlertModule, DatepickerModule, ButtonsModule, CollapseModule } from 'ng2-bootstrap';
import { Store, StoreEnhancer, createStore } from 'redux';

import { AppComponent } from './app.component';
import { routing, appRoutingProviders } from './app.routing';

import { PrototypeModule } from './prototype/prototype.module';
import { DemoModule } from './demo/demo.module';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PaymentComponent } from './payment/payment.component';
import { DonationComponent } from './donation/donation.component';
import { BillingComponent } from './billing/billing.component';

import { GiftService } from './services/gift.service';

import { GivingStore } from './giving-state/giving.store';
import { GivingState } from './giving-state/giving.interfaces';
import { givingReducer } from './giving-state/giving.reducer';


let devtools: StoreEnhancer<GivingState> =
      window['devToolsExtension'] ?
        window['devToolsExtension']() : f => f;

let store: Store<GivingState> = createStore<GivingState>(
  givingReducer,
  devtools
);

@NgModule({
  imports:      [
    AlertModule,
    BrowserModule,
    ButtonsModule,
    CollapseModule,
    CommonModule,
    HttpModule,
    DatepickerModule,
    ReactiveFormsModule,
    routing,
    PrototypeModule,
    DemoModule,

  ],
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    PaymentComponent,
    DonationComponent,
    BillingComponent
  ],
  providers:    [
    appRoutingProviders,
    GiftService,
    { provide: GivingStore, useValue: store }
  ],
  bootstrap:    [AppComponent]
})
export class AppModule { }
