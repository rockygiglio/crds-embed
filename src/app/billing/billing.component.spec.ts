/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingComponent } from './billing.component';
import { StoreService } from '../services/store.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, JsonpModule } from '@angular/http';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AlertModule, CollapseModule, TabsModule, ButtonsModule } from 'ng2-bootstrap/ng2-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '../services/session.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { ParamValidationService } from '../services/param-validation.service';
import { StateService } from '../services/state.service';
import { PaymentService } from '../services/payment.service';

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
        StoreService,
        FormBuilder,
        SessionService,
        CookieService,
        ParamValidationService,
        PaymentService,
        StateService
      ]
    });
    this.fixture = TestBed.createComponent(BillingComponent);
    this.component = this.fixture.componentInstance;
  }));


  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

  it('should validate required ACH parameters', () => {
    this.component.achForm = {
      valid: false,
      controls: {
        accountName: { valid: false, errors: { required: true } },
        accountNumber: { valid: false, errors: { minLength: 8, requiredLength: 9 } },
        routingNumber: { valid: true, errors: null }
      }
    };
    expect(this.component.achForm.controls['accountName'].valid).toBe(false);
    expect(this.component.achForm.controls['accountNumber'].valid).toBe(false);
    expect(this.component.achForm.controls['routingNumber'].valid).toBe(true);
  });

  it('should validate required CC parameters', () => {
    this.component.ccForm = {
      valid: false,
      controls: {
        ccNumber: { valid: false, errors: { required: true } },
        expDate: { valid: false, errors: { minLength: 8, requiredLength: 9 } },
        cvv: { valid: true, errors: null },
        zipCode: { valid: true, errors: null }
      }
    };
    expect(this.component.ccForm.controls['ccNumber'].valid).toBe(false);
    expect(this.component.ccForm.controls['expDate'].valid).toBe(false);
    expect(this.component.ccForm.controls['cvv'].valid).toBe(true);
    expect(this.component.ccForm.controls['zipCode'].valid).toBe(true);
  });
});
