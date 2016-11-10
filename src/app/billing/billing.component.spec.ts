/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingComponent } from './billing.component';
import { GiftService } from '../services/gift.service';
import { GivingStore } from '../giving-state/giving.store';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, JsonpModule } from '@angular/http';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ExistingPaymentInfoService } from '../services/existing-payment-info.service';
import { AlertModule, CollapseModule, TabsModule, ButtonsModule } from 'ng2-bootstrap/ng2-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { HttpClientService } from '../services/http-client.service';
import { UserSessionService } from '../services/user-session.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { ParamValidationService } from '../services/param-validation.service';
import { DonationFundService } from '../services/donation-fund.service';
import { QuickDonationAmountsService } from '../services/quick-donation-amounts.service';
import { PreviousGiftAmountService } from '../services/previous-gift-amount.service';
import { StateManagerService } from '../services/state-manager.service';

class MockDonationFundService { }
class MockQuickDonationAboutsService { }
class MockPreviousGiftAmountService { }
class MockGiftService { }
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
        UserSessionService,
        CookieService,
        ParamValidationService,
        StateManagerService
      ]
    });
    this.fixture = TestBed.createComponent(BillingComponent);
    this.component = this.fixture.componentInstance;
  }));


  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });
});
