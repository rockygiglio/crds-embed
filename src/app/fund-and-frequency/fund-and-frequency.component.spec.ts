/* tslint:disable:no-unused-variable */

import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { DatepickerModule } from 'ng2-bootstrap/ng2-bootstrap';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';

import { DonationFundService } from '../services/donation-fund.service';
import { ExistingPaymentInfoService } from '../services/existing-payment-info.service';
import { FundAndFrequencyComponent } from './fund-and-frequency.component';
import { HttpClientService } from '../services/http-client.service';
import { GiftService } from '../services/gift.service';
import { LoginService } from '../services/login.service';
import { ParamValidationService } from '../services/param-validation.service';
import { PaymentService } from '../services/payment.service';
import { PreviousGiftAmountService } from '../services/previous-gift-amount.service';
import { StateManagerService } from '../services/state-manager.service';
import { StripeService } from '../services/stripe.service';
import { QuickDonationAmountsService } from '../services/quick-donation-amounts.service';


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
        GiftService,
        ParamValidationService,
        DonationFundService,
        QuickDonationAmountsService,
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

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });


});
