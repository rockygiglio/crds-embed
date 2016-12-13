import { AlertModule, ButtonsModule, CollapseModule, DatepickerModule } from 'ng2-bootstrap/ng2-bootstrap';
import { Angulartics2Module, Angulartics2GoogleTagManager } from 'angulartics2';
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
import { AmountComponent } from './amount/amount.component';
import { SummaryComponent, WindowToken, _window } from './summary/summary.component';
import { RegisterComponent} from './register/register.component';

import { DonationFundService } from './services/donation-fund.service';
import { ExistingPaymentInfoService } from './services/existing-payment-info.service';
import { StoreService } from './services/store.service';
import { HttpClientService } from './services/http-client.service';
import { LoginService } from './services/login.service';
import { ParamValidationService } from './services/param-validation.service';
import { PaymentService } from './services/payment.service';
import { PreviousGiftAmountService } from './services/previous-gift-amount.service';
import { StateService } from './services/state.service';
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
    AmountComponent,
    SimpleCreditCardFormatDirective,
    SummaryComponent,
    RegisterComponent
  ],
  providers:    [
    appRoutingProviders,
    CookieService,
    DonationFundService,
    ExistingPaymentInfoService,
    StoreService,
    HttpClientService,
    LoginService,
    ParamValidationService,
    PaymentService,
    PreviousGiftAmountService,
    StateService,
    RegistrationService,
    {provide: WindowToken, useFactory: _window},
  ],
  bootstrap:    [AppComponent]
})
export class AppModule { }
