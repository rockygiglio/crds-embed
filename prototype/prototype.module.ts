import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, JsonpModule  } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { createStore, Store, StoreEnhancer } from 'redux';
import { AlertModule, ButtonsModule, CollapseModule, DatepickerModule, TabsModule } from 'ng2-bootstrap/ng2-bootstrap';
import { PreloaderModule } from '../preloader/preloader.module';

import { PrototypeComponent } from './prototype.component';
import { prototypeRouting } from './prototype.routing';
import { PrototypeGiftAmountComponent } from './prototype-gift-amount/prototype-gift-amount.component';
import { PrototypeDetailsComponent } from './prototype-details/prototype-details.component';
import { PrototypeAuthenticationComponent } from './prototype-authentication/prototype-authentication.component';
import { PrototypePaymentComponent } from './prototype-payment/prototype-payment.component';
import { PrototypeSummaryComponent } from './prototype-summary/prototype-summary.component';
import { PrototypeSwitchComponent } from './prototype-switch/prototype-switch.component';
import { PrototypeConfirmationComponent } from './prototype-confirmation/prototype-confirmation.component';

import { prototypeReducer } from './prototype-state/prototype.reducer';
import { PrototypeState } from './prototype-state/prototype.interfaces';
import { PrototypeStore } from './prototype-state/prototype.store';
import { PrototypeGiftService } from './prototype-gift.service';
import { QuickDonationAmountsService } from '../services/quick-donation-amounts.service';
import { DonationFundService } from '../services/donation-fund.service';
import { PreviousGiftAmountService } from '../services/previous-gift-amount.service';
import { LoginService } from '../services/login.service';
import { ExistingPaymentInfoService } from '../services/existing-payment-info.service';
import { PrototypeRegistrationComponent } from './prototype-registration/prototype-registration.component';
import { PrototypePasswordComponent } from './prototype-password/prototype-password.component';
import { PrototypeEmailComponent } from './prototype-email/prototype-email.component';
import { PrototypePaymentAmountComponent } from './prototype-payment-amount/prototype-payment-amount.component';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { UserSessionService } from '../services/user-session.service';
import { HttpClientService } from '../services/http-client.service';
import { ParamValidationService } from '../services/param-validation.service';
import { StripeService } from '../services/stripe.service';
import { PaymentService } from '../services/payment.service';


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
    CollapseModule,
    CommonModule,
    HttpModule,
    DatepickerModule,
    prototypeRouting,
    ReactiveFormsModule,
    TabsModule,
    JsonpModule,
    PreloaderModule
  ],
  declarations: [
    PrototypeComponent,
    PrototypeGiftAmountComponent,
    PrototypeDetailsComponent,
    PrototypeAuthenticationComponent,
    PrototypePaymentComponent,
    PrototypeSummaryComponent,
    PrototypeSwitchComponent,
    PrototypeConfirmationComponent,
    PrototypeRegistrationComponent,
    PrototypePasswordComponent,
    PrototypeEmailComponent,
    PrototypePaymentAmountComponent
  ],
  providers: [
    PrototypeGiftService,
    QuickDonationAmountsService,
    DonationFundService,
    PreviousGiftAmountService,
    LoginService,
    CookieService,
    ExistingPaymentInfoService,
    UserSessionService,
    HttpClientService,
    ParamValidationService,
    StripeService,
    PaymentService,
    { provide: PrototypeStore, useValue: store }
  ]
})

export class PrototypeModule { }
