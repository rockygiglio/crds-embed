/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Rx';

import { SummaryComponent, WindowToken } from './summary.component';
import { GiftService } from '../services/gift.service';
import { ExistingPaymentInfoService } from '../services/existing-payment-info.service';
import { HttpModule } from '@angular/http';
import { HttpClientService } from '../services/http-client.service';
import { LoginService } from '../services/login.service';
import { CookieService } from 'angular2-cookie/core';
import { StateManagerService } from '../services/state-manager.service';
import { ParamValidationService } from '../services/param-validation.service';
import { DonationFundService } from '../services/donation-fund.service';
import { QuickDonationAmountsService } from '../services/quick-donation-amounts.service';
import { PreviousGiftAmountService } from '../services/previous-gift-amount.service';
import { PaymentService } from '../services/payment.service';
import { StripeService } from '../services/stripe.service';

import { CrdsDonor } from '../models/crds-donor';
import { PaymentCallBody } from '../models/payment-call-body';

class MockStateManagerService {
  public getNextPageToShow(currentPage: number): string {
    return '/confirmation';
  }
  public getPrevPageToShow(currentPage: number): string {
    return '/billing';
  }
  public unhidePage(pageIndex: number) { }
  public hidePage(pageIndex: number) { }
  public setLoading(val: boolean) { }
}

describe('Component: Summary', () => {

  let component: any;
  let fixture: any;
  let mockWindow: Window = <any>{
    top: {
      location: {
        href: 'http://parent.com'
      }
    },
    location: {
      href: 'http://child.com'
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryComponent ],
      imports: [
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule, HttpModule
      ],
      providers:    [
        GiftService, ExistingPaymentInfoService,
        HttpClientService, CookieService,
        { provide: StateManagerService, useClass: MockStateManagerService},
        { provide: WindowToken, useValue: mockWindow},
        ParamValidationService, DonationFundService, LoginService,
        QuickDonationAmountsService, PreviousGiftAmountService,
        PaymentService, StripeService,
      ]
    });
    this.fixture = TestBed.createComponent(SummaryComponent);
    this.component = this.fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

  it('should get last 4 digits of cc account number', () => {
    this.component.gift.paymentType = 'cc';
    this.component.gift.ccNumber = '1212343456567878';
    expect(this.component.getLastFourOfAccountNumber()).toBe('7878');
  });

  it('should get last 4 digits of bank account number', () => {
    this.component.gift.paymentType = 'ach';
    this.component.gift.accountNumber = '123456789';
    expect(this.component.getLastFourOfAccountNumber()).toBe('6789');
  });

  it('should navigate back', () => {
    spyOn(this.component.router, 'navigateByUrl');
    this.component.back();
    expect(this.component.router.navigateByUrl).toHaveBeenCalledWith('/billing');
  });

  it('should navigate to passed in url after submit', () => {
      this.component.gift.overrideParent = true;
      this.component.gift.url = 'http://www.redirecturl.com';
      this.component.next();
      expect(this.component.window.top.location.href).toBe(this.component.gift.url);
    }
  );

  it('should submit payment with cc', () => {
    this.component.gift.paymentType = 'cc';
    this.component.gift.amount = 12.34;
    this.component.gift.invoiceId = 1234;
    this.component.gift.donor = new CrdsDonor(123, 'test@test.com', 'John', 'Doe', 'post');
    let paymentBody = new PaymentCallBody(this.component.gift.amount, 'cc', 'PAYMENT', this.component.gift.invoiceId );
    spyOn(this.component.paymentService, 'makeApiDonorCall').and.returnValue(Observable.of({}));
    spyOn(this.component.paymentService, 'postPayment').and.returnValue(Observable.of({}));
    this.component.submitPayment();
    expect(this.component.paymentService.postPayment).toHaveBeenCalledWith(paymentBody);
  });

  it('should submit payment with bank', () => {
    this.component.gift.paymentType = 'ach';
    this.component.gift.amount = 12.34;
    this.component.gift.invoiceId = 1234;
    this.component.gift.donor = new CrdsDonor(123, 'test@test.com', 'John', 'Doe', 'post');
    let paymentBody = new PaymentCallBody(this.component.gift.amount, 'bank', 'PAYMENT', this.component.gift.invoiceId );
    spyOn(this.component.paymentService, 'makeApiDonorCall').and.returnValue(Observable.of({}));
    spyOn(this.component.paymentService, 'postPayment').and.returnValue(Observable.of({}));
    this.component.submitPayment();
    expect(this.component.paymentService.postPayment).toHaveBeenCalledWith(paymentBody);
  });

  xit('should submit donation', () => {
    expect(this.component).toBeTruthy();
  });

  it('should reset payment info on link to billing page', () => {
    this.component.gift.paymentType = 'cc';
    spyOn(this.component.gift, 'resetExistingPaymentInfo');
    this.component.changePayment();
    expect(this.component.gift.resetExistingPaymentInfo).toHaveBeenCalled();
    expect(this.component.gift.paymentType).toBeUndefined();
  });

  it('should logout user on link to auth page', () => {
    spyOn(this.component.loginService, 'logOut');
    this.component.changeUser();
    expect(this.component.loginService.logOut).toHaveBeenCalled();
  });

  xit('should add redirect params to redirect url', () => {
    this.component.gift.url = 'http://www.redirecturl.com';
    this.component.redirectParams.set('param1', 1);
    this.component.redirectParams.set('param2', 'two');
    this.component.addParamsToRedirectUrl();
    expect(this.component.gift.url).toBe('http://www.redirecturl.com?param1=1&param2=two');
  });

});
