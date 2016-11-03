/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { PrototypeSummaryComponent } from './prototype-summary.component';
import { PrototypeStore } from '../prototype-state/prototype.store';
import { PrototypeGiftService } from '../prototype-gift.service';
import { ExistingPaymentInfoService } from '../../services/existing-payment-info.service';
import { HttpModule } from '@angular/http';
import { UserSessionService } from '../../services/user-session.service';
import { HttpClientService } from '../../services/http-client.service';
import { CookieService } from 'angular2-cookie/core';

class MockPrototypeStore { public subscribe() {}; }

describe('Component: PrototypeSummary', () => {

  let component;
  let fixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ PrototypeSummaryComponent ],
      imports: [
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule, HttpModule
      ],
      providers:    [
        { provide: PrototypeStore, useClass: MockPrototypeStore },
        PrototypeGiftService, ExistingPaymentInfoService, UserSessionService,
        HttpClientService, CookieService
      ]
    });
    this.fixture = TestBed.createComponent(PrototypeSummaryComponent);
    this.component = this.fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

});
