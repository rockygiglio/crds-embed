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
import { Frequency } from '../models/frequency';
import { StoreService } from '../services/store.service';
import { HttpClientService } from '../services/http-client.service';
import { LoginService } from '../services/login.service';
import { ParamValidationService } from '../services/param-validation.service';
import { PaymentService } from '../services/payment.service';
import { PreviousGiftAmountService } from '../services/previous-gift-amount.service';
import { Program } from '../models/program';
import { StateService } from '../services/state.service';
import { StripeService } from '../services/stripe.service';
import { QuickDonationAmountsService } from '../services/quick-donation-amounts.service';


class MockActivatedRoute {
  public snapshot = {
    queryParams: []
  };
}

describe('Component: FundAndFrequency', () => {

  let component: any;
  let currentDateTime: Date = new Date();
  let currentDateTime2: Date = undefined;
  let fixture: any;

  let giveFrequencies: any = {
    oneTime: new Frequency('One Time', 'once', false),
    weekly: new Frequency('Weekly', 'week', true),
    monthly: new Frequency('Monthly', 'month', true)
  };

  let mockFund: Program = {
    'ProgramId': 5,
    'Name': 'General Giving',
    'ProgramType': 1,
    'AllowRecurringGiving': true
  };

  let mockOneTimeGiftFund: Program = {
    'ProgramId': 5,
    'Name': 'General Giving',
    'ProgramType': 1,
    'AllowRecurringGiving': false
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FundAndFrequencyComponent
      ],
      imports: [
        DatepickerModule,
        HttpModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        CookieService,
        DonationFundService,
        ExistingPaymentInfoService,
        StoreService,
        HttpClientService,
        LoginService,
        ParamValidationService,
        PaymentService,
        PreviousGiftAmountService,
        QuickDonationAmountsService,
        StateService,
        StripeService
      ]
    });
    this.fixture = TestBed.createComponent(FundAndFrequencyComponent);
    this.component = this.fixture.componentInstance;
  });

  it('should reset the date to the current date time', () => {
    currentDateTime2 = new Date();
    this.component.store.start_date = undefined;
    this.component.resetDate();

    expect(this.component.store.start_date.toString()).toBe(currentDateTime2.toString());
  });

  it('should set the gift fund object to whatever fund is passed in', () => {
    this.component.store.fund = undefined;
    this.component.onClickFund(mockFund);

    expect(this.component.store.fund.ProgramId).toBe(mockFund.ProgramId);
  });

  it('should set frequency for the fund IF it allows re-occurring gifts', () => {
    this.component.onClickFund(mockFund);
    this.component.onClickFrequency(giveFrequencies.weekly);

    expect(this.component.store.frequency.value).toBe(giveFrequencies.weekly.value);
  });

  it('should NOT set frequency for the fund to anything other than "once" if it does not allow reoccurring', () => {
    this.component.onClickFund(mockOneTimeGiftFund);
    this.component.onClickFrequency(giveFrequencies.weekly);

    expect(this.component.store.frequency.value).toBe(giveFrequencies.oneTime.value);
  });

  it('should set date to undefined', () => {
    this.component.onClickChangeDate();

    expect(this.component.store.start_date ).toBe(undefined);
  });

  it('should set date to whatever date is passed in from the datepicker', () => {
    this.component.onClickChangeDate();
    this.component.onClickDate(currentDateTime);

    expect(this.component.store.start_date ).toBe(currentDateTime);
  });

  describe('#Frequency model', () => {
    it('should create an array of default frequencies for recurring giving', () => {
      expect(this.component.store.frequencies.length).toBeGreaterThan(0);
      expect(this.component.store.getFirstNonRecurringFrequency().value).toBe('once');
    });

  });

});
