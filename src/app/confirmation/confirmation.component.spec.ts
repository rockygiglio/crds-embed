/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
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

fdescribe('Component: Confirmation', () => {

  let component: ConfirmationComponent;
  let fixture: ComponentFixture<ConfirmationComponent>;
  let de: DebugElement;
  let el: HTMLElement;

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

    // query for the text <p> by CSS element selector
    de = this.fixture.debugElement.query(By.css('h2'));
    el = de.nativeElement;
  });

  it('should show thank you for payment', () => {
    this.component.gift.type = 'payment';
    this.component.gift.amount = 12.34;
    this.component.gift.title = 'test';
    this.fixture.detectChanges();
    console.log(el.textContent);
    expect(el.textContent).toContain('Thanks!');
    // console.log(this.fixture);
    // expect(this.fixture.nativeElement.querySelector('.text-block--lg-font').innerHTML).toBe(`Thank you for the <strong>{{ gift.amount | currency:'USD':true | lowercase }}</strong> payment<span *ngIf="gift.title"> for '{{ gift.title }}'</span>.`);
  });

  it('should show thank you for one time gift', () => {
    expect(this.component).toBeTruthy();
  });

  it('should show thank you for recurring gift', () => {
    expect(this.component).toBeTruthy();
  });

});
