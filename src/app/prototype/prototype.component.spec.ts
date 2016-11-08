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
import { PreloaderModule } from '../preloader/preloader.module';

class MockPrototypeStore { public subscribe() {}; }
class MockHttpClientService { public get() {}; }
class MockUserSessionService { public getAccessToken() {}; }

describe('Component: Prototype', () => {

  let fixture,
      component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ PrototypeComponent ],
      imports: [
        RouterTestingModule.withRoutes([]), HttpModule, JsonpModule, PreloaderModule,
      ],
      providers:    [
        { provide: PrototypeStore, useClass: MockPrototypeStore },
        { provide: HttpClientService, useClass: MockHttpClientService },
        { provide: UserSessionService, useClass: MockUserSessionService },
        PrototypeGiftService, QuickDonationAmountsService, PreviousGiftAmountService, CookieService
      ]
    });
    fixture = TestBed.createComponent(PrototypeComponent);
    component = fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

});
