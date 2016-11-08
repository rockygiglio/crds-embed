import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PrototypeStore } from './prototype-state/prototype.store';
import { PrototypeComponent } from './prototype.component';
import { PrototypeGiftService } from './prototype-gift.service';
import { QuickDonationAmountsService } from '../services/quick-donation-amounts.service';
import { PreviousGiftAmountService } from '../services/previous-gift-amount.service';
import { HttpModule, JsonpModule  } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { HttpClientService } from '../services/http-client.service';
import { UserSessionService } from '../services/user-session.service';

class MockPrototypeStore { public subscribe() {}; }
class MockHttpClientService { public get() {}; }
class MockUserSessionService { public getAccessToken() {}; }

describe('Component: Prototype', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ PrototypeComponent ],
      imports: [
        RouterTestingModule.withRoutes([]), HttpModule, JsonpModule
      ],
      providers:    [
        { provide: PrototypeStore, useClass: MockPrototypeStore },
        { provide: HttpClientService, useClass: MockHttpClientService },
        { provide: UserSessionService, useClass: MockUserSessionService },
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
