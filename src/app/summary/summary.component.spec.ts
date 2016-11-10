/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { SummaryComponent } from './summary.component';
import { GivingStore } from '../giving-state/giving.store';
import { GiftService } from '../services/gift.service';
import { ExistingPaymentInfoService } from '../services/existing-payment-info.service';
import { HttpModule } from '@angular/http';
import { UserSessionService } from '../services/user-session.service';
import { HttpClientService } from '../services/http-client.service';
import { CookieService } from 'angular2-cookie/core';

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
        { provide: GivingStore, useClass: MockStore },
        GiftService, ExistingPaymentInfoService, UserSessionService,
        HttpClientService, CookieService
      ]
    });
    this.fixture = TestBed.createComponent(SummaryComponent);
    this.component = this.fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

});
