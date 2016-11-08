/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingComponent } from './billing.component';
import { GiftService } from '../services/gift.service';
import { GivingStore } from '../giving-state/giving.store';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, JsonpModule } from '@angular/http';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ExistingPaymentInfoService } from '../services/existing-payment-info.service';
import { AlertModule, CollapseModule, TabsModule, ButtonsModule } from 'ng2-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { HttpClientService } from '../services/http-client.service';
import { UserSessionService } from '../services/user-session.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { ParamValidationService } from '../services/param-validation.service';

class MockGivingStore { public subscribe() {}; }
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
        HttpModule
      ],
      providers: [
        { provide: GivingStore, useClass: MockGivingStore },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        GiftService,
        ExistingPaymentInfoService,
        FormBuilder,
        HttpClientService,
        UserSessionService,
        CookieService,
        ParamValidationService
      ]
    });
    this.fixture = TestBed.createComponent(BillingComponent);
    this.component = this.fixture.componentInstance;
  }));


  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });
});
