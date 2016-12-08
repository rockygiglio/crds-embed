/* tslint:disable:no-unused-variable */
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, JsonpModule  } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';

import { DonationFundService } from '../services/donation-fund.service';
import { ExistingPaymentInfoService } from '../services/existing-payment-info.service';
import { GiftService } from '../services/gift.service';
import { ParamValidationService } from '../services/param-validation.service';
import { AmountComponent } from './amount.component';
import { PreviousGiftAmountService } from '../services/previous-gift-amount.service';
import { QuickDonationAmountsService } from '../services/quick-donation-amounts.service';
import { StateManagerService } from '../services/state-manager.service';
import { LoginService } from '../services/login.service';
import { HttpClientService } from '../services/http-client.service';
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';

import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap';

describe('Component: Payment', () => {

  let component;
  let fixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ AmountComponent ],
      imports: [
        RouterTestingModule.withRoutes([]), HttpModule, JsonpModule, ReactiveFormsModule, AlertModule
      ],
      providers: [
        ExistingPaymentInfoService,
        PreviousGiftAmountService,
        QuickDonationAmountsService,
        DonationFundService,
        GiftService,
        ParamValidationService,
        StateManagerService,
        LoginService,
        HttpClientService,
        CookieService
      ]
    });
    this.fixture = TestBed.createComponent(AmountComponent);
    this.component = this.fixture.componentInstance;

    this.component.gift.type = 'payment';
    this.component.gift.minPayment = 1;
    this.component.gift.totalCost = 400;

  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

  it('should expect non-numeric values to invalidate', () => {

    this.component.onCustomAmount('034adfdf');
    expect(this.component.gift.validAmount()).toBeFalsy();

  });

  it('should expect amounts higher than the total cost to invalidate', () => {

    this.component.onCustomAmount('400.01');
    expect(this.component.gift.validAmount()).toBeFalsy();

  });

  it('should expect amounts lower than the total cost to validate', () => {

    this.component.onCustomAmount('399.99');
    expect(this.component.gift.validAmount()).toBeTruthy();

  });

  it('should expect amounts higher than 999,999.99 to invalidate', () => {

    this.component.onCustomAmount('1000000');
    expect(this.component.gift.validAmount()).toBeFalsy();

  });

  it('should expect amounts with leading zeros to invalidate', () => {

    this.component.onCustomAmount('01');
    expect(this.component.gift.validAmount()).toBeFalsy();

  });

});

describe('Component: Donation', () => {

  let component;
  let fixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ AmountComponent ],
      imports: [
        RouterTestingModule.withRoutes([]), HttpModule, JsonpModule, ReactiveFormsModule, AlertModule
      ],
      providers: [
        ExistingPaymentInfoService,
        PreviousGiftAmountService,
        QuickDonationAmountsService,
        DonationFundService,
        GiftService,
        ParamValidationService,
        StateManagerService,
        LoginService,
        HttpClientService,
        CookieService
      ]
    });
    this.fixture = TestBed.createComponent(AmountComponent);
    this.component = this.fixture.componentInstance;

    this.component.gift.type = 'donation';
    this.component.gift.previousAmount = 53.17;
    this.component.gift.fundId = 1;

  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

  it('should expect a valid gift amount to validate', () => {

    this.component.onCustomAmount('300.01');
    expect(this.component.isValid()).toBeTruthy();

  });

  it('should expect an invalid gift amount to invalidate', () => {

    this.component.onCustomAmount('300.01adfdf');
    expect(this.component.isValid()).toBeFalsy();

  });

});
