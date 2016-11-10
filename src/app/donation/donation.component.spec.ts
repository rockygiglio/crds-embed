/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DonationComponent } from './donation.component';
import { HttpModule, JsonpModule  } from '@angular/http';
import { GiftService } from '../services/gift.service';
import { ParamValidationService } from '../services/param-validation.service';
import { DonationFundService } from '../services/donation-fund.service';
import { QuickDonationAmountsService } from '../services/quick-donation-amounts.service';
import { UserSessionService } from '../services/user-session.service';
import { PreviousGiftAmountService } from '../services/previous-gift-amount.service';
import { ExistingPaymentInfoService } from '../services/existing-payment-info.service';

class MockDonationService { }
class MockQuickDonationAmountsService { }
class MockUserSessionService { }
class MockPreviousGiftAmountService { }
class MockExistingPaymentInfoService { }
class MockGiftService { }
class MockPrototypeStore { public subscribe() {}; }
class MockRouter { public navigate() {}; }
import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap';

describe('Component: Donation', () => {

  let component;
  let fixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ DonationComponent ],
      imports: [
        RouterTestingModule.withRoutes([]), HttpModule, JsonpModule, AlertModule
      ],
      providers: [
        { provide: DonationFundService, useClass: MockDonationService },
        { provide: QuickDonationAmountsService, useClass: MockQuickDonationAmountsService },
        { provide: UserSessionService, useClass: MockUserSessionService },
        { provide: PreviousGiftAmountService, useClass: MockPreviousGiftAmountService },
        { provide: ExistingPaymentInfoService, useClass: MockExistingPaymentInfoService },
        { provide: GiftService, useClass: MockGiftService },
        ParamValidationService
      ]
    });
    this.fixture = TestBed.createComponent(DonationComponent);
    this.component = this.fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

});