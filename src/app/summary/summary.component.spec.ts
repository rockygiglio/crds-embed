/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Rx';

import { SummaryComponent, WindowToken } from './summary.component';
import { StoreService } from '../services/store.service';
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
import { DonationService } from '../services/donation.service';

import { Donor } from '../models/donor';
import { PaymentCallBody } from '../models/payment-call-body';
import { Frequency } from '../models/frequency';

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
  public watchState() {}
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
        StoreService, ExistingPaymentInfoService, DonationService,
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
    this.component.store.paymentType = 'cc';
    this.component.store.ccNumber = '1212343456567878';
    expect(this.component.getLastFourOfAccountNumber()).toBe('7878');
  });

  it('should get last 4 digits of bank account number', () => {
    this.component.store.paymentType = 'ach';
    this.component.store.accountNumber = '123456789';
    expect(this.component.getLastFourOfAccountNumber()).toBe('6789');
  });

  it('should navigate back', () => {
    spyOn(this.component.router, 'navigateByUrl');
    this.component.back();
    expect(this.component.router.navigateByUrl).toHaveBeenCalledWith('/billing');
  });

  it('should navigate to passed in url after submit', () => {
      this.component.store.overrideParent = true;
      this.component.store.url = 'http://www.redirecturl.com';
      this.component.next();
      expect(this.component.window.top.location.href).toBe(this.component.store.url);
    }
  );

  it('should submit PAYMENT with cc', () => {
    this.component.store.paymentType = 'cc';
    this.component.store.amount = 12.34;
    this.component.store.invoiceId = 1234;
    this.component.store.donor = new Donor(123, 'test@test.com', 'John', 'Doe', 'post');
    let paymentBody = new PaymentCallBody('', this.component.store.amount, 'cc', 'PAYMENT', this.component.store.invoiceId );
    spyOn(this.component.paymentService, 'makeApiDonorCall').and.returnValue(Observable.of({}));
    spyOn(this.component.paymentService, 'postPayment').and.returnValue(Observable.of({}));
    spyOn(this.component.router, 'navigateByUrl').and.stub();
    this.component.submitPayment();
    expect(this.component.paymentService.makeApiDonorCall).toHaveBeenCalled();
    expect(this.component.paymentService.postPayment).toHaveBeenCalledWith(paymentBody);
  });

  it('should submit PAYMENT with bank', () => {
    this.component.store.paymentType = 'ach';
    this.component.store.amount = 12.34;
    this.component.store.invoiceId = 1234;
    this.component.store.donor = new Donor(123, 'test@test.com', 'John', 'Doe', 'post');
    let paymentBody = new PaymentCallBody('', this.component.store.amount, 'bank', 'PAYMENT', this.component.store.invoiceId );
    spyOn(this.component.paymentService, 'makeApiDonorCall').and.returnValue(Observable.of({}));
    spyOn(this.component.paymentService, 'postPayment').and.returnValue(Observable.of({}));
    spyOn(this.component.router, 'navigateByUrl').and.stub();
    this.component.submitPayment();
    expect(this.component.paymentService.makeApiDonorCall).toHaveBeenCalled();
    expect(this.component.paymentService.postPayment).toHaveBeenCalledWith(paymentBody);
  });

  it('should submit ONE TIME DONATION with cc', () => {

    this.component.store.paymentType = 'cc';
    this.component.store.amount = 12.34;
    this.component.store.fund = {
      'ProgramId': 1,
      'Name': 'Programmer Caffination Fund',
      'ProgramType': 1,
      'AllowRecurringGiving': false
    };
    this.component.store.fund_id = 1;
    this.component.store.frequency = new Frequency('One Time', 'once', false);
    this.component.store.email = 'test@test.com';
    this.component.store.donor = new Donor(123, this.component.store.email, 'John', 'Doe', 'post');

    let paymentBody = new PaymentCallBody(this.component.store.fund.ProgramId.toString(),
      this.component.store.amount,
      'cc',
      'DONATION',
      0);

    spyOn(this.component.paymentService, 'makeApiDonorCall').and.returnValue(Observable.of({ id: 1 }));
    spyOn(this.component.paymentService, 'postPayment').and.returnValue(Observable.of({}));
    spyOn(this.component.router, 'navigateByUrl').and.stub();
    this.component.submitDonation();
    expect(this.component.paymentService.makeApiDonorCall).toHaveBeenCalled();
    expect(this.component.paymentService.postPayment).toHaveBeenCalledWith(paymentBody);
  });

  it('should submit ONE TIME DONATION with bank', () => {

    this.component.store.paymentType = 'ach';
    this.component.store.amount = 12.34;
    this.component.store.fund = {
      'ProgramId': 1,
      'Name': 'Programmer Caffination Fund',
      'ProgramType': 1,
      'AllowRecurringGiving': false
    };
    this.component.store.fund_id = 1;
    this.component.store.frequency = new Frequency('One Time', 'once', false);
    this.component.store.email = 'test@test.com';
    this.component.store.donor = new Donor(123, this.component.store.email, 'John', 'Doe', 'post');

    let paymentBody = new PaymentCallBody(this.component.store.fund.ProgramId.toString(),
      this.component.store.amount,
      'bank',
      'DONATION',
      0);

    spyOn(this.component.paymentService, 'makeApiDonorCall').and.returnValue(Observable.of({ id: 1 }));
    spyOn(this.component.paymentService, 'postPayment').and.returnValue(Observable.of({}));
    spyOn(this.component.router, 'navigateByUrl').and.stub();
    this.component.submitDonation();
    expect(this.component.paymentService.makeApiDonorCall).toHaveBeenCalled();
    expect(this.component.paymentService.postPayment).toHaveBeenCalledWith(paymentBody);
  });

  it('should submit GUEST ONE TIME DONATION', () => {

    this.component.store.paymentType = 'ach';
    this.component.store.amount = 12.34;
    this.component.store.fund = {
      'ProgramId': 1,
      'Name': 'Programmer Caffination Fund',
      'ProgramType': 1,
      'AllowRecurringGiving': false
    };
    this.component.store.fund_id = 1;
    this.component.store.frequency = new Frequency('One Time', 'once', false);
    this.component.store.email = 'test@test.com';
    this.component.store.donor = new Donor(123, this.component.store.email, 'John', 'Doe', 'post');
    this.component.store.isGuest = true;

    let paymentBody = new PaymentCallBody(this.component.store.fund.ProgramId.toString(),
      this.component.store.amount,
      'bank',
      'DONATION',
      0);

    paymentBody.email_address = this.component.store.email;
    paymentBody.donor_id = 1;

    spyOn(this.component.paymentService, 'makeApiDonorCall').and.returnValue(Observable.of({ id: 1 }));
    spyOn(this.component.paymentService, 'postPayment').and.returnValue(Observable.of({}));
    spyOn(this.component.router, 'navigateByUrl').and.stub();
    this.component.submitDonation();
    expect(this.component.paymentService.makeApiDonorCall).toHaveBeenCalled();
    expect(this.component.paymentService.postPayment).toHaveBeenCalledWith(paymentBody);
  });

  it('should reset payment info on link to billing page', () => {
    this.component.store.paymentType = 'cc';
    spyOn(this.component.store, 'resetExistingPmtInfo');
    this.component.changePayment();
    expect(this.component.store.resetExistingPmtInfo).toHaveBeenCalled();
    expect(this.component.store.paymentType).toBeUndefined();
  });

  it('should logout user on link to auth page', () => {
    spyOn(this.component.loginService, 'logOut');
    this.component.changeUser();
    expect(this.component.loginService.logOut).toHaveBeenCalled();
  });

  it('should add redirect params to redirect url', () => {
    this.component.store.url = 'http://www.redirecturl.com';
    this.component.redirectParams.set('param1', 1);
    this.component.redirectParams.set('param2', 'two');
    this.component.addParamsToRedirectUrl();
    expect(this.component.store.url).toBe('http://www.redirecturl.com?param1=1&param2=two');
  });

});
