import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrototypeComponent } from './prototype.component';
import { prototypeRouting } from './prototype.routing';
import { PrototypeAmountComponent } from './prototype-amount/prototype-amount.component';
import { PrototypeDetailsComponent } from './prototype-details/prototype-details.component';
import { PrototypeAuthenticationComponent } from './prototype-authentication/prototype-authentication.component';
import { PrototypePaymentComponent } from './prototype-payment/prototype-payment.component';
import { PrototypeSummaryComponent } from './prototype-summary/prototype-summary.component';
import { PrototypeConfirmationComponent } from './prototype-confirmation/prototype-confirmation.component';

import { createStore, Store, StoreEnhancer } from 'redux';

import { prototypeReducer } from './prototype-state/prototype.reducer';
import { PrototypeState } from './prototype-state/prototype.interfaces';
import { PrototypeStore } from './prototype-state/prototype.store';

let devtools: StoreEnhancer<PrototypeState> =
  window['devToolsExtension'] ?
  window['devToolsExtension']() : f => f;

let store: Store<PrototypeState> = createStore<PrototypeState>(
  prototypeReducer,
  devtools
);


@NgModule({
  imports: [
    CommonModule,
    prototypeRouting
  ],
  declarations: [
    PrototypeComponent,
    PrototypeAmountComponent,
    PrototypeDetailsComponent,
    PrototypeAuthenticationComponent,
    PrototypePaymentComponent,
    PrototypeSummaryComponent,
    PrototypeConfirmationComponent
  ],
  providers: [
    { provide: PrototypeStore, useValue: store }
  ]
})
export class PrototypeModule { }
