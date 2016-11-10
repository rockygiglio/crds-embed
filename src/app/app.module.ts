import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleTagManager } from 'angulartics2/dist/providers';
import { AlertModule, ButtonsModule, CollapseModule, DatepickerModule } from 'ng2-bootstrap/ng2-bootstrap';

import { AppComponent } from './app.component';
import { routing, appRoutingProviders } from './app.routing';

import { DemoModule } from './demo/demo.module';
import { PreloaderModule } from './preloader/preloader.module';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PaymentComponent } from './payment/payment.component';
import { DonationComponent } from './donation/donation.component';
import { BillingComponent } from './billing/billing.component';
import { SummaryComponent } from './summary/summary.component';
import { AuthenticationComponent } from './authentication/authentication.component';

import { GiftService } from './services/gift.service';
import { StateManagerService } from './services/state-manager.service';
import { LoadingService } from './services/loading.service';
import { ParamValidationService } from './services/param-validation.service';
import { QuickDonationAmountsService } from './services/quick-donation-amounts.service';
import { DonationFundService } from './services/donation-fund.service';
import { PreviousGiftAmountService } from './services/previous-gift-amount.service';
import { LoginService } from './services/login.service';
import { ExistingPaymentInfoService } from './services/existing-payment-info.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { UserSessionService } from './services/user-session.service';
import { HttpClientService } from './services/http-client.service';
import { PaymentService } from './services/payment.service';
import { StripeService } from './services/stripe.service';

import { CreditCardFormatDirective } from './directives/credit-card-format.directive';
import { ExpirayFormatDirective } from './directives/expiry-format.directive';
import { CvcFormatDirective } from './directives/cvc-format.directive';

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
    BillingComponent,
    SummaryComponent,
    AuthenticationComponent,
    CreditCardFormatDirective,
    ExpirayFormatDirective,
    CvcFormatDirective
  ],
  providers:    [
    appRoutingProviders,
    QuickDonationAmountsService,
    DonationFundService,
    PreviousGiftAmountService,
    LoginService,
    CookieService,
    ExistingPaymentInfoService,
    UserSessionService,
    HttpClientService,
    ParamValidationService,
    StateManagerService,
    LoadingService,
    GiftService,
    PaymentService,
    ParamValidationService,
    StripeService,
    Angulartics2GoogleTagManager
  ],
  bootstrap:    [AppComponent]
})
export class AppModule { }
