/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute } from '@angular/router';
import { AlertModule, ButtonsModule, CollapseModule, TabsModule } from 'ng2-bootstrap/ng2-bootstrap';
import { BillingComponent } from './billing.component';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { CreditCardValidator } from '../validators/credit-card.validator';
import { DonationFundService } from '../services/donation-fund.service';
import { ExistingPaymentInfoService } from '../services/existing-payment-info.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { GiftService } from '../services/gift.service';
import { HttpClientService } from '../services/http-client.service';
import { HttpModule, JsonpModule } from '@angular/http';
import { ParamValidationService } from '../services/param-validation.service';
import { PaymentService } from '../services/payment.service';
import { PreviousGiftAmountService } from '../services/previous-gift-amount.service';
import { QuickDonationAmountsService } from '../services/quick-donation-amounts.service';
import { RouterTestingModule } from '@angular/router/testing';
import { StateManagerService } from '../services/state-manager.service';
import { StripeService } from '../services/stripe.service';

class MockDonationFundService { }
class MockQuickDonationAboutsService { }
class MockPreviousGiftAmountService { }
class MockGiftService { 
  public resetErrors() {
    return {};
  }
}
class MockActivatedRoute {
  public snapshot = {
    queryParams: []
  };
}

describe('Component: Billing', () => {
  let component: BillingComponent;
  let fixture: ComponentFixture<BillingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingComponent ],
      imports: [
        AlertModule,
        CollapseModule,
        ReactiveFormsModule,
        TabsModule,
        ButtonsModule,
        HttpModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: DonationFundService, useClass: MockDonationFundService },
        { provide: QuickDonationAmountsService, useClass: MockQuickDonationAboutsService },
        { provide: PreviousGiftAmountService, useClass: MockPreviousGiftAmountService },
        { provide: GiftService, useClass: MockGiftService },
        ExistingPaymentInfoService,
        FormBuilder,
        HttpClientService,
        CookieService,
        ParamValidationService,
        PaymentService,
        StripeService,
        StateManagerService
      ]
    });
    this.fixture = TestBed.createComponent(BillingComponent);
    this.component = this.fixture.componentInstance;
  }));

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

  describe('Form validations', () => {
     describe('for ACH Form', () => {
      it('should be valid with required parameters provided', () => {
        this.component.achForm.setValue({accountName: 'Bob Dillinger', accountNumber: '123123456789', routingNumber: '110000000', accountType: 'individual'});

        expect(this.component.achForm.valid).toBe(true);
      });

      it('should be invalid with required parameters not provided', () => {
        this.component.achForm.setValue({accountName: '', accountNumber: null, routingNumber: null, accountType: 'individual'});

        expect(this.component.achForm.valid).toBe(false);
      });

      it('should be invalid with required parameters partially provided', () => {
        this.component.achForm.setValue({accountName: 'Bob Dillinger', accountNumber: '12345', routingNumber: '1100', accountType: 'individual'});

        expect(this.component.achForm.valid).toBe(false);
      });
    });

    describe('for CC Form', () => {
      fit('should be valid with required parameters provided', () => {
        spyOn(CreditCardValidator, 'validateCCNumber');
        this.component.ccForm.setValue({ccNumber: '4242424242424242', expDate: '09/31', cvv: '345', zipCode: '34567'});

        expect(this.component.ccForm.valid).toBe(true);
      });

      it('should be invalid with required parameters not provided', () => {
        this.component.ccForm.setValue({ccNumber: null, expDate: null, cvv: null, zipCode: null});

        expect(this.component.ccForm.valid).toBe(false);
      });

      it('should be invalid with required parameters partially provided', () => {
        this.component.ccForm.setValue({ccNumber: '424242', expDate: '02/', cvv: '34', zipCode: '234'});

        expect(this.component.ccForm.valid).toBe(false);
      });
    });
  });
});
