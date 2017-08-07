/* tslint:disable:no-unused-variable */
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, JsonpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';

import { APIService } from '../services/api.service';
import { ContentService } from '../services/content.service';
import { IFrameParentService } from '../services/iframe-parent.service';
import { IsPredefinedToggleDirective } from '../directives/is-predefined-toggle.directive';
import { SessionService } from '../services/session.service';
import { StateService } from '../services/state.service';
import { StoreService } from '../services/store.service';
import { ValidationService } from '../services/validation.service';
import { AnalyticsService } from '../services/analytics.service';

import { AmountComponent } from './amount.component';

import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap';

describe('Component: Amount ?type=payment', () => {

  let component;
  let fixture;
  let mockAnalyticsService;

  beforeEach(() => {
    mockAnalyticsService = jasmine.createSpyObj<AnalyticsService>('analyticsService', ['giveModalViewed', 'trackAmountSubmitted']);
    TestBed.configureTestingModule({
      declarations: [
        AmountComponent,
        IsPredefinedToggleDirective
      ],
      imports: [
        RouterTestingModule.withRoutes([]), HttpModule, JsonpModule, ReactiveFormsModule, AlertModule
      ],
      providers: [
        IFrameParentService,
        StoreService,
        ValidationService,
        StateService,
        APIService,
        SessionService,
        CookieService,
        ContentService,
        ValidationService,
        { provide: AnalyticsService, useValue: mockAnalyticsService }
      ]
    });
    this.fixture = TestBed.createComponent(AmountComponent);
    this.component = this.fixture.componentInstance;

    this.component.store.type = 'payment';
    this.component.store.minPayment = 1;
    this.component.store.totalCost = 400;

  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

  it('should expect non-numeric values to invalidate', () => {

    this.component.onCustomAmount('034adfdf');
    expect(this.component.store.validAmount()).toBeFalsy();

  });

  it('should expect amounts higher than the total cost to invalidate', () => {

    this.component.onCustomAmount('400.01');
    expect(this.component.store.validAmount()).toBeFalsy();

  });

  it('should expect amounts lower than the total cost to validate', () => {

    this.component.onCustomAmount('399.99');
    expect(this.component.store.validAmount()).toBeTruthy();

  });

  it('should expect amounts higher than 999,999.99 to invalidate', () => {

    this.component.onCustomAmount('1000000');
    expect(this.component.store.validAmount()).toBeFalsy();

  });

  it('should expect amounts less than .25 to invalidated', () => {

    this.component.onCustomAmount('.24');
    expect(this.component.store.validAmount()).toBeFalsy();

  });

});

describe('Component: Amount ?type=donation', () => {

  let component;
  let fixture;
  let mockAnalyticsService;

  beforeEach(() => {
    mockAnalyticsService = jasmine.createSpyObj<AnalyticsService>('analyticsService', ['giveModalViewed', 'trackAmountSubmitted']);
    TestBed.configureTestingModule({
      declarations: [
        AmountComponent,
        IsPredefinedToggleDirective
      ],
      imports: [
        RouterTestingModule.withRoutes([]), HttpModule, JsonpModule, ReactiveFormsModule, AlertModule
      ],
      providers: [
        IFrameParentService,
        StoreService,
        ValidationService,
        StateService,
        APIService,
        SessionService,
        ContentService,
        CookieService,
        { provide: AnalyticsService, useValue: mockAnalyticsService }
      ]
    });
    this.fixture = TestBed.createComponent(AmountComponent);
    this.component = this.fixture.componentInstance;

    this.component.store.type = 'donation';
    this.component.store.previousAmount = 53.17;
    this.component.store.fundId = 1;

  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

  it('should expect a valid amount to validate', () => {

    this.component.onCustomAmount('300.01');
    expect(this.component.store.validAmount()).toBeTruthy();

  });

  it('should expect an invalid amount to invalidate', () => {

    this.component.onCustomAmount('300.01adfdf');
    expect(this.component.store.validAmount()).toBeFalsy();

  });

  describe('amount Analytics', () => {
    let type = 'donation';
    let amount = 987.98;
    let form = { controls: { customAmount: { markAsTouched: () => { } } } };

    beforeEach(() => {
      this.component.store.type = type;
      this.component.store.amount = amount;
      this.component.form = form;
      spyOn(this.component.store, 'validAmount').and.returnValue(true);
      spyOn(this.component.state, 'setLoading');
      spyOn(this.component.state, 'getNextPageToShow').and.returnValue('test');
      spyOn(this.component.router, 'navigateByUrl');
      spyOn(this.component.form.controls['customAmount'], 'markAsTouched');
      spyOn(this.component, 'setErrorMessage');
    });

    it('should call giveModalViewed, is Donation', () => {
      this.component.ngOnInit();
      expect(mockAnalyticsService.giveModalViewed).toHaveBeenCalled();
    });

    it('should not call giveModalViewed, is not Donation', () => {
      this.component.store.type = 'payment';
      this.component.ngOnInit();
      expect(mockAnalyticsService.giveModalViewed).not.toHaveBeenCalled();
    });

    it('should call trackAmountSubmitted, is Donation', () => {
      this.component.submitAmount();
      expect(mockAnalyticsService.trackAmountSubmitted).toHaveBeenCalledWith(amount);
    });

    it('should not call trackAmountSubmitted, is not Donation', () => {
      this.component.store.type = 'payment';
      this.component.submitAmount();
      expect(mockAnalyticsService.trackAmountSubmitted).not.toHaveBeenCalled();
    });
  });
});
