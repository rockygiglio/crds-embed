/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { SummaryComponent } from './summary.component';
import { GiftService } from '../services/gift.service';
import { ExistingPaymentInfoService } from '../services/existing-payment-info.service';
import { HttpModule } from '@angular/http';
import { UserSessionService } from '../services/user-session.service';
import { HttpClientService } from '../services/http-client.service';
import { CookieService } from 'angular2-cookie/core';
import { StateManagerService } from '../services/state-manager.service';
import { ParamValidationService } from '../services/param-validation.service';
import { DonationFundService } from '../services/donation-fund.service';
import { QuickDonationAmountsService } from '../services/quick-donation-amounts.service';
import { PreviousGiftAmountService } from '../services/previous-gift-amount.service';

class MockStore { public subscribe() {}; }

describe('Component: Summary', () => {

  let component: any;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryComponent ],
      imports: [
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule, HttpModule
      ],
      providers:    [
        GiftService, ExistingPaymentInfoService, UserSessionService,
        HttpClientService, CookieService, StateManagerService,
        ParamValidationService, DonationFundService,
        QuickDonationAmountsService, PreviousGiftAmountService
      ]
    });
    this.fixture = TestBed.createComponent(SummaryComponent);
    this.component = this.fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

});
