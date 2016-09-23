import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createStore, Store, StoreEnhancer } from 'redux';
import { AlertModule, ButtonsModule, TabsModule } from 'ng2-bootstrap/ng2-bootstrap';

import { PrototypeComponent } from './prototype.component';
import { prototypeRouting } from './prototype.routing';
import { PrototypeAmountComponent } from './prototype-amount/prototype-amount.component';
import { PrototypeDetailsComponent } from './prototype-details/prototype-details.component';
import { PrototypeAuthenticationComponent } from './prototype-authentication/prototype-authentication.component';
import { PrototypePaymentComponent } from './prototype-payment/prototype-payment.component';
import { PrototypeSummaryComponent } from './prototype-summary/prototype-summary.component';
import { PrototypeConfirmationComponent } from './prototype-confirmation/prototype-confirmation.component';

import { prototypeReducer } from './prototype-state/prototype.reducer';
import { PrototypeState } from './prototype-state/prototype.interfaces';
import { PrototypeStore } from './prototype-state/prototype.store';
import { PrototypeGiftService } from './prototype-gift.service';
import { PrototypeRegistrationComponent } from './prototype-registration/prototype-registration.component';
import { PrototypePasswordComponent } from './prototype-password/prototype-password.component';

let devtools: StoreEnhancer<PrototypeState> =
  window['devToolsExtension'] ?
  window['devToolsExtension']() : f => f;

let store: Store<PrototypeState> = createStore<PrototypeState>(
  prototypeReducer,
  devtools
);


@NgModule({
  imports: [
    AlertModule,
    ButtonsModule,
    CommonModule,
    prototypeRouting,
    TabsModule
  ],
  declarations: [
    PrototypeComponent,
    PrototypeAmountComponent,
    PrototypeDetailsComponent,
    PrototypeAuthenticationComponent,
    PrototypePaymentComponent,
    PrototypeSummaryComponent,
    PrototypeConfirmationComponent,
    PrototypeRegistrationComponent,
    PrototypePasswordComponent
  ],
  providers: [
    PrototypeGiftService,
    { provide: PrototypeStore, useValue: store }
  ]
})
export class PrototypeModule { }
