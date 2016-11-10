/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { PrototypeGiftAmountComponent } from './prototype-gift-amount.component';
import { PrototypeStore } from '../prototype-state/prototype.store';
import { PrototypeGiftService } from '../prototype-gift.service';
import { ExistingPaymentInfoService } from '../../services/existing-payment-info.service';
import { UserSessionService } from '../../services/user-session.service';
import { HttpClientService } from '../../services/http-client.service';
import { CookieService } from 'angular2-cookie/core';

import { ActivatedRoute } from '@angular/router';

class MockPrototypeStore { public subscribe() {}; }
class MockActivatedRoute { }

describe('Component: PrototypeGiftAmount', () => {

  let component: any;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ PrototypeGiftAmountComponent ],
      imports: [
        ReactiveFormsModule, HttpModule
      ],
      providers:    [
        { provide: PrototypeStore, useClass: MockPrototypeStore },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        PrototypeGiftService,
        ExistingPaymentInfoService, UserSessionService,
        HttpClientService, CookieService
      ]
    });
    this.fixture = TestBed.createComponent(PrototypeGiftAmountComponent);
    this.component = this.fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });
});
