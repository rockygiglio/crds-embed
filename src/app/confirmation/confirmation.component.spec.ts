/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { ConfirmationComponent } from './confirmation.component';
import { HttpModule, JsonpModule  } from '@angular/http';
import { GiftService } from '../services/gift.service';
import { ParamValidationService } from '../services/param-validation.service';
import { DonationFundService } from '../services/donation-fund.service';
import { QuickDonationAmountsService } from '../services/quick-donation-amounts.service';
import { PreviousGiftAmountService } from '../services/previous-gift-amount.service';
import { ExistingPaymentInfoService } from '../services/existing-payment-info.service';

class MockDonationService { }
class MockQuickDonationAmountsService { }
class MockPreviousGiftAmountService { }
class MockExistingPaymentInfoService { }
class MockGiftService { }
class MockRouter { public navigate() {}; }
class MockPrototypeStore { public subscribe() {}; }

describe('Component: Confirmation', () => {

  let component: any;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationComponent ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]), HttpModule
      ],
      providers:    [
        { provide: DonationFundService, useClass: MockDonationService },
        { provide: QuickDonationAmountsService, useClass: MockQuickDonationAmountsService },
        { provide: PreviousGiftAmountService, useClass: MockPreviousGiftAmountService },
        { provide: ExistingPaymentInfoService, useClass: MockExistingPaymentInfoService },
        { provide: GiftService, useClass: MockGiftService },
        ParamValidationService
      ]
    });
    this.fixture = TestBed.createComponent(ConfirmationComponent);
    this.component = this.fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

});
