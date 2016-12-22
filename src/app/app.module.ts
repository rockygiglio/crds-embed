import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Angulartics2Module, Angulartics2GoogleTagManager } from 'angulartics2';
import { AlertModule, ButtonsModule, CollapseModule, DatepickerModule } from 'ng2-bootstrap/ng2-bootstrap';

import { AppComponent } from './app.component';
import { routing, appRoutingProviders } from './app.routing';

import { DemoModule } from './demo/demo.module';
import { PreloaderModule } from './preloader/preloader.module';

import { AmountComponent } from './amount/amount.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { BillingComponent } from './billing/billing.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { FundAndFrequencyComponent  } from './fund-and-frequency/fund-and-frequency.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterComponent} from './register/register.component';
import { SummaryComponent, WindowToken, _window } from './summary/summary.component';

import { APIService } from './services/api.service';
import { IFrameParentService } from './services/iframe-parent.service';
import { SessionService } from './services/session.service';
import { StateService } from './services/state.service';
import { StoreService } from './services/store.service';
import { ValidationService } from './services/validation.service';
import { ContentService } from './services/content.service';

import { CreditCardFormatDirective } from './directives/credit-card-format.directive';
import { CurrencyFormatDirective } from './directives/currency-format.directive';
import { CvvFormatDirective } from './directives/cvv-format.directive';
import { ExpiryFormatDirective } from './directives/expiry-format.directive';
import { IsPredefinedToggleDirective } from './directives/is-predefined-toggle.directive';
import { OnlyTheseKeysDirective } from './directives/only-these-keys.directive';
import { FormatPaymentNumberDirective } from './directives/format-payment-number.directive';

@NgModule({
  imports: [
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
    AmountComponent,
    AppComponent,
    AuthenticationComponent,
    BillingComponent,
    ConfirmationComponent,
    CreditCardFormatDirective,
    CurrencyFormatDirective,
    CvvFormatDirective,
    ExpiryFormatDirective,
    IsPredefinedToggleDirective,
    FundAndFrequencyComponent,
    OnlyTheseKeysDirective,
    PageNotFoundComponent,
    RegisterComponent,
    FormatPaymentNumberDirective,
    SummaryComponent,
  ],
  providers: [
    appRoutingProviders,
    ContentService,
    CookieService,
    APIService,
    IFrameParentService,
    SessionService,
    StateService,
    StoreService,
    ValidationService,
    {provide: WindowToken, useFactory: _window}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
