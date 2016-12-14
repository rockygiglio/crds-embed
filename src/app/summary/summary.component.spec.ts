/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Rx';

import { SummaryComponent, WindowToken } from './summary.component';
import { StoreService } from '../services/store.service';
import { HttpModule } from '@angular/http';
import { SessionService } from '../services/session.service';
import { CookieService } from 'angular2-cookie/core';
import { StateService } from '../services/state.service';
import { ValidationService } from '../services/validation.service';
import { APIService } from '../services/api.service';

import { Donor } from '../models/donor';
import { RecurringDonor } from '../models/recurring-donor';
import { Payment } from '../models/payment';
import { Frequency } from '../models/frequency';
import { Fund } from '../models/fund';

class MockStateService {
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
        StoreService,
        SessionService,
        CookieService,
        { provide: StateService, useClass: MockStateService},
        { provide: WindowToken, useValue: mockWindow},
        ValidationService,
        APIService
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
      this.component.adv();
      expect(this.component.window.top.location.href).toBe(this.component.store.url);
    }
  );

  it('should submit PAYMENT with cc', () => {
    this.component.store.paymentType = 'cc';
    this.component.store.amount = 12.34;
    this.component.store.invoiceId = 1234;
    this.component.store.donor = new Donor(123, 'test@test.com', 'post');
    let paymentBody = new Payment('', this.component.store.amount, 'cc', 'PAYMENT', this.component.store.invoiceId );
    spyOn(this.component.api, 'createOrUpdateDonor').and.returnValue(Observable.of({}));
    spyOn(this.component.api, 'postPayment').and.returnValue(Observable.of({}));
    spyOn(this.component.router, 'navigateByUrl').and.stub();
    this.component.submitPayment();
    expect(this.component.api.createOrUpdateDonor).toHaveBeenCalled();
    expect(this.component.api.postPayment).toHaveBeenCalledWith(paymentBody);
  });

  it('should submit PAYMENT with bank', () => {
    this.component.store.paymentType = 'ach';
    this.component.store.amount = 12.34;
    this.component.store.invoiceId = 1234;
    this.component.store.donor = new Donor(123, 'test@test.com', 'post');
    let paymentBody = new Payment('', this.component.store.amount, 'bank', 'PAYMENT', this.component.store.invoiceId );
    spyOn(this.component.api, 'createOrUpdateDonor').and.returnValue(Observable.of({}));
    spyOn(this.component.api, 'postPayment').and.returnValue(Observable.of({}));
    spyOn(this.component.router, 'navigateByUrl').and.stub();
    this.component.submitPayment();
    expect(this.component.api.createOrUpdateDonor).toHaveBeenCalled();
    expect(this.component.api.postPayment).toHaveBeenCalledWith(paymentBody);
  });

  it('should submit ONE TIME DONATION with cc', () => {

    this.component.store.paymentType = 'cc';
    this.component.store.amount = 12.34;
    this.component.store.fund = new Fund(1, 'Programmer Caffination Fund', 1, false);
    this.component.store.frequency = new Frequency('One Time', 'once', false);
    this.component.store.email = 'test@test.com';
    this.component.store.donor = new Donor(123, this.component.store.email, 'post');

    let paymentBody = new Payment(this.component.store.fund.ID.toString(),
      this.component.store.amount,
      'cc',
      'DONATION',
      0);

    spyOn(this.component.api, 'createOrUpdateDonor').and.returnValue(Observable.of({ id: 1 }));
    spyOn(this.component.api, 'postPayment').and.returnValue(Observable.of({}));
    spyOn(this.component.router, 'navigateByUrl').and.stub();
    this.component.submitDonation();
    expect(this.component.api.createOrUpdateDonor).toHaveBeenCalled();
    expect(this.component.api.postPayment).toHaveBeenCalledWith(paymentBody);
  });

  it('should submit ONE TIME DONATION with bank', () => {

    this.component.store.paymentType = 'ach';
    this.component.store.amount = 12.34;
    this.component.store.fund = new Fund(1, 'mer Caffination Fund', 1, false);
    this.component.store.frequency = new Frequency('One Time', 'once', false);
    this.component.store.email = 'test@test.com';
    this.component.store.donor = new Donor(123, this.component.store.email, 'post');

    let paymentBody = new Payment(this.component.store.fund.ID.toString(),
      this.component.store.amount,
      'bank',
      'DONATION',
      0);

    spyOn(this.component.api, 'createOrUpdateDonor').and.returnValue(Observable.of({ id: 1 }));
    spyOn(this.component.api, 'postPayment').and.returnValue(Observable.of({}));
    spyOn(this.component.router, 'navigateByUrl').and.stub();
    this.component.submitDonation();
    expect(this.component.api.createOrUpdateDonor).toHaveBeenCalled();
    expect(this.component.api.postPayment).toHaveBeenCalledWith(paymentBody);
  });

  it('should submit RECURRING DONATION with cc', () => {

    this.component.store.paymentType = 'cc';
    this.component.store.amount = 12.34;
    this.component.store.fund = new Fund(1, 'Programmer Caffination Fund', 1, false);
    this.component.store.frequency = new Frequency('Weekly', 'week', true);
    this.component.store.startDate = new Date();
    this.component.store.recurringDonor = new RecurringDonor(
      '123',
      this.component.store.amount,
      this.component.store.fund.ID.toString(),
      this.component.store.frequency.value,
      this.component.store.startDate.toISOString().slice(0, 10)
    );

    spyOn(this.component.api, 'postRecurringGift').and.returnValue(Observable.of({}));
    spyOn(this.component.router, 'navigateByUrl').and.stub();
    this.component.submitDonation();
    expect(this.component.api.postRecurringGift).toHaveBeenCalledWith(this.component.store.recurringDonor);
  });

  it('should submit RECURRING DONATION with bank', () => {

    this.component.store.paymentType = 'ach';
    this.component.store.amount = 12.34;
    this.component.store.fund = new Fund(1, 'Programmer Caffination Fund', 1, false);
    this.component.store.frequency = new Frequency('Weekly', 'week', true);
    this.component.store.startDate = new Date();
    this.component.store.recurringDonor = new RecurringDonor(
      '123',
      this.component.store.amount,
      this.component.store.fund.ID.toString(),
      this.component.store.frequency.value,
      this.component.store.startDate.toISOString().slice(0, 10)
    );

    spyOn(this.component.api, 'postRecurringGift').and.returnValue(Observable.of({}));
    spyOn(this.component.router, 'navigateByUrl').and.stub();
    this.component.submitDonation();
    expect(this.component.api.postRecurringGift).toHaveBeenCalledWith(this.component.store.recurringDonor);
  });

  it('should submit GUEST ONE TIME DONATION', () => {

    this.component.store.paymentType = 'ach';
    this.component.store.amount = 12.34;
    this.component.store.fund = new Fund(1, 'Programmer Caffination Fund', 1, false);
    this.component.store.frequency = new Frequency('One Time', 'once', false);
    this.component.store.email = 'test@test.com';
    this.component.store.donor = new Donor(123, this.component.store.email, 'post');
    this.component.store.donor.donor_id = 1;
    this.component.store.isGuest = true;

    let paymentBody = new Payment(this.component.store.fund.ID.toString(),
      this.component.store.amount,
      'bank',
      'DONATION',
      0);

    paymentBody.email_address = this.component.store.email;
    paymentBody.donor_id = 1;

    spyOn(this.component.api, 'createOrUpdateDonor').and.returnValue(Observable.of({ id: 1 }));
    spyOn(this.component.api, 'postPayment').and.returnValue(Observable.of({}));
    spyOn(this.component.router, 'navigateByUrl').and.stub();
    this.component.submitDonation();
    expect(this.component.api.createOrUpdateDonor).toHaveBeenCalled();
    expect(this.component.api.postPayment).toHaveBeenCalledWith(paymentBody);
  });

  it('should reset payment info on link to billing page', () => {
    this.component.store.paymentType = 'cc';
    spyOn(this.component.store, 'resetExistingPmtInfo');
    this.component.changePayment();
    expect(this.component.store.resetExistingPmtInfo).toHaveBeenCalled();
    expect(this.component.store.paymentType).toBeUndefined();
  });

  it('should logout user on link to auth page', () => {
    spyOn(this.component.api, 'logOut');
    this.component.changeUser();
    expect(this.component.api.logOut).toHaveBeenCalled();
  });

  it('should add redirect params to redirect url', () => {
    this.component.store.url = 'http://www.redirecturl.com';
    this.component.redirectParams.set('param1', 1);
    this.component.redirectParams.set('param2', 'two');
    this.component.addParamsToRedirectUrl();
    expect(this.component.store.url).toBe('http://www.redirecturl.com?param1=1&param2=two');
  });

});
