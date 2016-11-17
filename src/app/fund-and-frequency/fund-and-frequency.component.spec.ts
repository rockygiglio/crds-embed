/* tslint:disable:no-unused-variable */

import { HttpModule } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { DatepickerModule } from 'ng2-bootstrap/ng2-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';

import { FundAndFrequencyComponent } from './fund-and-frequency.component';
import { GiftService } from '../services/gift.service';
import { ParamValidationService } from '../services/param-validation.service.ts';
import { DonationFundService } from '../services/donation-fund.service';
import { QuickDonationAmountsService } from '../services/quick-donation-amounts.service';

import { ActivatedRoute } from '@angular/router';

import { StateManagerService } from '../services/state-manager.service';
import { PreviousGiftAmountService } from '../services/previous-gift-amount.service';
import { LoginService } from '../services/login.service';
import { ExistingPaymentInfoService } from '../services/existing-payment-info.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { HttpClientService } from '../services/http-client.service';
import { PaymentService } from '../services/payment.service';
import { StripeService } from '../services/stripe.service';


class MockActivatedRoute {
  public snapshot = {
    queryParams: []
  };
}

describe('Component: FundAndFrequency', () => {

  let component: any;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ FundAndFrequencyComponent ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        DatepickerModule,
        HttpModule
      ],
      providers:    [
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        GiftService, ParamValidationService, DonationFundService, QuickDonationAmountsService,
        PreviousGiftAmountService,
        LoginService,
        CookieService,
        ExistingPaymentInfoService,
        HttpClientService,
        StateManagerService,
        PaymentService,
        StripeService
      ]
    });
    this.fixture = TestBed.createComponent(FundAndFrequencyComponent);
    this.component = this.fixture.componentInstance;
  });

  fit('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });


});
