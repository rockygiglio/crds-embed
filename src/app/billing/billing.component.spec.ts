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

export class TestHelper {
  static setAchForm(achForm: any, name: string, routing: number, account: number) {
    achForm.controls['accountName'].setValue(name);
    achForm.controls['accountName'].markAsTouched();
    achForm.controls['accountName'].markAsDirty();
    achForm.controls['accountNumber'].setValue(account);
    achForm.controls['accountNumber'].markAsTouched();
    achForm.controls['accountNumber'].markAsDirty();
    achForm.controls['routingNumber'].setValue(routing);
    achForm.controls['routingNumber'].markAsTouched();
    achForm.controls['routingNumber'].markAsDirty();
  }

  static setCcForm(ccForm: any, ccNumber: number, exp: string, cvv: number, zip: number) {
    ccForm.controls['ccNumber'].setValue(ccNumber);
    ccForm.controls['ccNumber'].markAsTouched();
    ccForm.controls['expDate'].setValue(exp);
    ccForm.controls['expDate'].markAsTouched();
    ccForm.controls['cvv'].setValue(cvv);
    ccForm.controls['cvv'].markAsTouched();
    ccForm.controls['zipCode'].setValue(zip);
    ccForm.controls['zipCode'].markAsTouched();
  }
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
      fit('should be valid with required parameters provided', () => {
        TestHelper.setAchForm(this.component.achForm, 'Bob Dillinger', 110000000, 123123456789);
        this.component.achNext();
        expect(this.component.achForm.valid).toBe(true);
      });

      it('should be invalid with required parameters not provided', () => {
        TestHelper.setAchForm(this.component.achForm, '', null, null);
        this.component.achNext();
        expect(this.component.achForm.valid).toBe(true);
      });

      it('should be invalid with required parameters partially provided', () => {
        TestHelper.setAchForm(this.component.achForm, 'Bob Dillinger', 1100, 12345); 
        this.component.achNext();
        expect(this.component.achForm.valid).toBe(true);
      });
    });

    describe('for CC Form', () => {
      it('should be valid with required parameters provided', () => {
        TestHelper.setCcForm(this.component.ccForm, 4242424242424242, '09/31', 345, 34567);
        expect(this.component.ccForm.valid).toBe(true);
      });

      it('should be invalid with required parameters not provided', () => {
        TestHelper.setCcForm(this.component.ccForm, null, null, null, null);
        this.component.ccNext();
        expect(this.component.ccForm.valid).toBe(false);
      });

      it('should be invalid with required parameters partially provided', () => {
        TestHelper.setCcForm(this.component.ccForm, 424242, '02/', 34, 234);
        this.component.ccNext();
        expect(this.component.ccForm.valid).toBe(false);
      });
    });
  });
});
