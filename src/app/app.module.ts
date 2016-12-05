import { AlertModule, ButtonsModule, CollapseModule, DatepickerModule } from 'ng2-bootstrap/ng2-bootstrap';
import { Angulartics2GoogleTagManager } from 'angulartics2/dist/providers';
import { Angulartics2Module } from 'angulartics2';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { routing, appRoutingProviders } from './app.routing';

import { DemoModule } from './demo/demo.module';
import { PreloaderModule } from './preloader/preloader.module';

import { AuthenticationComponent } from './authentication/authentication.component';
import { BillingComponent } from './billing/billing.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { FundAndFrequencyComponent  } from './fund-and-frequency/fund-and-frequency.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PaymentComponent } from './payment/payment.component';
import { SummaryComponent, WindowToken, _window } from './summary/summary.component';
import { RegisterComponent} from './register/register.component';

import { DonationService } from './services/donation.service';
import { DonationFundService } from './services/donation-fund.service';
import { ExistingPaymentInfoService } from './services/existing-payment-info.service';
import { GiftService } from './services/gift.service';
import { HttpClientService } from './services/http-client.service';
import { LoginService } from './services/login.service';
import { ParamValidationService } from './services/param-validation.service';
import { PaymentService } from './services/payment.service';
import { PreviousGiftAmountService } from './services/previous-gift-amount.service';
import { QuickDonationAmountsService } from './services/quick-donation-amounts.service';
import { StateManagerService } from './services/state-manager.service';
import { StripeService } from './services/stripe.service';
import { RegistrationService } from './services/registration.service';

import { CreditCardFormatDirective } from './directives/credit-card-format.directive';
import { CurrencyFormatDirective } from './directives/currency-format.directive';
import { CvvFormatDirective } from './directives/cvv-format.directive';
import { ExpiryFormatDirective } from './directives/expiry-format.directive';
import { OnlyTheseKeysDirective } from './directives/only-these-keys.directive';
import { SimpleCreditCardFormatDirective } from './directives/simple-credit-card-format.directive';

@NgModule({
  imports:      [
    AlertModule,
    Angulartics2Module.forRoot([Angulartics2GoogleTagManager]),
    BrowserModule,
    ButtonsModule,
    CollapseModule,
    CommonModule,
    DatepickerModule,
    DemoModule,
    HttpModule,
    PreloaderModule,
    ReactiveFormsModule,
    routing
  ],
  declarations: [
    AppComponent,
    AuthenticationComponent,
    BillingComponent,
    ConfirmationComponent,
    CreditCardFormatDirective,
    CvvFormatDirective,
    ExpiryFormatDirective,
    FundAndFrequencyComponent,
    OnlyTheseKeysDirective,
    CurrencyFormatDirective,
    PageNotFoundComponent,
    PaymentComponent,
    SimpleCreditCardFormatDirective,
    SummaryComponent,
    RegisterComponent
  ],
  providers:    [
    appRoutingProviders,
    CookieService,
    DonationService,
    DonationFundService,
    ExistingPaymentInfoService,
    GiftService,
    HttpClientService,
    LoginService,
    ParamValidationService,
    PaymentService,
    PreviousGiftAmountService,
    QuickDonationAmountsService,
    StateManagerService,
    StripeService,
<<<<<<<
    RegistrationService
=======
    {provide: WindowToken, useFactory: _window},
>>>>>>>
  ],
  bootstrap:    [AppComponent]
})
export class AppModule { }
