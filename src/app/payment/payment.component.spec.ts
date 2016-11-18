/* tslint:disable:no-unused-variable */
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, JsonpModule  } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';

import { DonationFundService } from '../services/donation-fund.service';
import { ExistingPaymentInfoService } from '../services/existing-payment-info.service';
import { GiftService } from '../services/gift.service';
import { ParamValidationService } from '../services/param-validation.service';
import { PaymentComponent } from './payment.component';
import { PreviousGiftAmountService } from '../services/previous-gift-amount.service';
import { QuickDonationAmountsService } from '../services/quick-donation-amounts.service';
import { StateManagerService } from '../services/state-manager.service';

class MockDonationFundService { }
class MockQuickDonationAmountsService { }
class MockPreviousGiftAmountService { }
class MockExistingPaymentInfoService { }
class MockGiftService {
  public validAmount(): boolean { return true; };
}
class MockGivingStore { public subscribe() {}; }
class MockRouter { public navigate() {}; }
import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap';

describe('Component: Payment', () => {

  let component;
  let fixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentComponent ],
      imports: [
        RouterTestingModule.withRoutes([]), HttpModule, JsonpModule, ReactiveFormsModule, AlertModule
      ],
      providers: [
        { provide: ExistingPaymentInfoService, useClass: MockExistingPaymentInfoService },
        { provide: PreviousGiftAmountService, useClass: MockPreviousGiftAmountService },
        { provide: QuickDonationAmountsService, useClass: MockQuickDonationAmountsService },
        { provide: DonationFundService, useClass: MockDonationFundService },
        { provide: GiftService, useClass: MockGiftService },
        ParamValidationService,
        StateManagerService
      ]
    });
    this.fixture = TestBed.createComponent(PaymentComponent);
    this.component = this.fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

  describe('isValid()', () => {
    it('returns true if form is valid and gift amount is valid', () => {
      this.component.form = {
        valid: true,
        controls: {
          amount: { valid: false, errors: { required: true } },
          customAmount: { valid: false, errors: { minLength: 8, requiredLength: 9 } },
          selectedAmount: { valid: true, errors: null }
        }
      };
      expect(this.component.isValid()).toBe(true);
    });

    xit('returns true if form is valid and gift amount is not valid', () => {
      this.component.form = {
        valid: true,
        controls: {
          amount: { valid: false, errors: { required: true } },
          customAmount: { valid: true, errors: { minLength: 8, requiredLength: 9 } },
          selectedAmount: { valid: false, errors: null }
        }
      };
      expect(this.component.isValid()).toBe(true);
    });

    it('returns true if form is not valid and gift amount is valid', () => {
      this.component.form = {
        valid: false,
        controls: {
          amount: { valid: false, errors: { required: true } },
          customAmount: { valid: true, errors: { minLength: 8, requiredLength: 9 } },
          selectedAmount: { valid: false, errors: null }
        }
      };
      expect(this.component.isValid()).toBe(true);
    });

    xit('returns false if form is not valid and gift amount is not valid', () => {

    });
  });

  xdescribe('next()', () => {
    it('registers that the form was submitted', () => {

    });

    it('advances the state manager', () => {

    });
  });

  xdescribe('onCustomAmount(value)', () => {
    it('sets the custom amount', () => {

    });
  });

  xdescribe('onSelectAmount(event, value)', () => {
    it('sets the selected amount', () => {

    });
  });

  xdescribe('setAmount(value)', () => {
    it('', () => {

    });
  });

});
