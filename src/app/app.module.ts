import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { Store, StoreEnhancer, createStore } from 'redux';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleTagManager } from 'angulartics2/dist/providers';
import { AlertModule, ButtonsModule, CollapseModule, DatepickerModule } from 'ng2-bootstrap';

import { AppComponent } from './app.component';
import { routing, appRoutingProviders } from './app.routing';

import { PrototypeModule } from './prototype/prototype.module';
import { DemoModule } from './demo/demo.module';
import { PreloaderModule } from './preloader/preloader.module';

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
    Angulartics2Module.forRoot(),
    PrototypeModule,
    DemoModule,
    ReactiveFormsModule,
    AlertModule,
    PreloaderModule,
    DemoModule
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
    { provide: GivingStore, useValue: store },
    Angulartics2GoogleTagManager
  ],
  bootstrap:    [AppComponent]
})
export class AppModule { }
