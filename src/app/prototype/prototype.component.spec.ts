/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { PrototypeStore } from './prototype-state/prototype.store';
import { PrototypeComponent } from './prototype.component';
import { PrototypeGiftAmountComponent } from './prototype-gift-amount/prototype-gift-amount.component';
import { PrototypePaymentAmountComponent } from './prototype-payment-amount/prototype-payment-amount.component';
import { PrototypeGiftService } from './prototype-gift.service';
import { QuickDonationAmountsService } from '../services/quick-donation-amounts.service';
import { PreviousGiftAmountService } from '../services/previous-gift-amount.service';
import { HttpModule, JsonpModule  } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';

class MockPrototypeStore { public subscribe() {}; }
class MockRouter { public navigate() {}; }

describe('Component: Prototype', () => {

  let component: any;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ PrototypeComponent ],
      imports: [
        RouterTestingModule.withRoutes([]), HttpModule, JsonpModule
      ],
      providers:    [
        { provide: PrototypeStore, useClass: MockPrototypeStore },
        PrototypeGiftService, QuickDonationAmountsService, PreviousGiftAmountService, CookieService
      ]
    });
    this.fixture = TestBed.createComponent(PrototypeComponent);
    this.component = this.fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

});
