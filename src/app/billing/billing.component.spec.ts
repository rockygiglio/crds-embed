/* tslint:disable:no-unused-variable */
import { ActivatedRoute } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';

import { AlertModule, ButtonsModule, CollapseModule, TabsModule } from 'ng2-bootstrap/ng2-bootstrap';
import { APIService } from '../services/api.service';
import { BillingComponent } from './billing.component';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { SessionService } from '../services/session.service';
import { StateService } from '../services/state.service';
import { StoreService } from '../services/store.service';
import { ValidationService } from '../services/validation.service';

class MockActivatedRoute {
  public snapshot = {
    queryParams: []
  };
}

class MockDonationFundService { }
class MockQuickDonationAboutsService { }
class MockPreviousGiftAmountService { }
class MockGiftService { 
  public resetErrors() {
    return {};
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
        StoreService,
        FormBuilder,
        SessionService,
        CookieService,
        ValidationService,
        APIService,
        StateService
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
      it('should be valid with required parameters provided', () => {
        this.component.ccForm.setValue({ccNumber: '4242424242424242', expDate: '09 / 27', cvv: '345', zipCode: '34567'});

        expect(this.component.ccForm.valid).toBe(true);
      });

      it('should be invalid with required parameters not provided', () => {
        this.component.ccForm.setValue({ccNumber: null, expDate: null, cvv: null, zipCode: null});
        console.log(this.component.ccForm);

        expect(this.component.ccForm.valid).toBe(false);
      });

      it('should be invalid with required parameters partially provided', () => {
        this.component.ccForm.setValue({ccNumber: '424242', expDate: '02 /', cvv: '34', zipCode: '234'});
        console.log(this.component.ccForm);

        expect(this.component.ccForm.valid).toBe(false);
      });
    });
  });
});
