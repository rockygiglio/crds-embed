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
import { Program } from '../interfaces/program';
import { DonationFundService } from '../services/donation-fund.service';
import { QuickDonationAmountsService } from '../services/quick-donation-amounts.service';
import { PreviousGiftAmountService } from '../services/previous-gift-amount.service';
import { ExistingPaymentInfoService } from '../services/existing-payment-info.service';
import { StateManagerService } from '../services/state-manager.service';

class MockDonationService { }
class MockQuickDonationAmountsService { }
class MockPreviousGiftAmountService { }
class MockExistingPaymentInfoService { }
class MockGiftService {
  public type: string = '';
  public isDonation() {
    if ( this.type === 'donation' ) {
      return true;
    } else {
      return false;
    }
  }

  public isPayment() {
    if ( this.type === 'payment' ) {
      return true;
    } else {
      return false;
    }
  }
}
class MockRouter { public navigate() {}; }
class MockPrototypeStore { public subscribe() {}; }

describe('Component: Confirmation', () => {

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
        ParamValidationService,
        StateManagerService
      ]
    });
    this.fixture = TestBed.createComponent(ConfirmationComponent);
    this.component = this.fixture.componentInstance;
    this.component.gift.email = 'user@test.com';
    this.component.gift.fund = {
      'ProgramId': 12,
      'Name': 'Programmer Caffination Fund',
      'ProgramType': 1,
      'AllowRecurringGiving': true
    };

  });

  it('should show thank you for payment', () => {
    this.component.gift.type = 'payment';
    this.component.gift.amount = 12.34;
    this.component.gift.title = 'frankincense and myrrh';
    this.fixture.detectChanges();
    de = this.fixture.debugElement.query(By.css('p.text-block--lg-font'));
    expect(de.nativeElement.textContent).toContain(`Thank you for the $12.34 payment for frankincense and myrrh.`);
  });

  it('should show thank you for monthly recurring gift', () => {
    this.component.gift.type = 'donation';
    this.component.gift.amount = 56.78;
    this.component.gift.frequency = 'Monthly';
    this.component.gift.start_date = new Date('December 6, 2016');
    this.fixture.detectChanges();
    de = this.fixture.debugElement.query(By.css('p.text-block--lg-font'));
    expect(de.nativeElement.textContent).toContain(
      `Your Recurring Gift was successfully created! Thank you for setting up a Recurring Gift.`
    );
    expect(de.nativeElement.textContent).toContain(
      `We will process your Recurring Gift of $56.78 for`
    );
    expect(de.nativeElement.textContent).toContain(
      `Programmer Caffination Fund on the 6th of the Month.`
    );
    expect(de.nativeElement.textContent).toContain(
      `Your statement will be sent to user@test.com.`
    );
  });

  it('should show thank you for weekly recurring gift', () => {
    this.component.gift.type = 'donation';
    this.component.gift.amount = 56.78;
    this.component.gift.frequency = 'Weekly';
    this.component.gift.start_date = new Date('December 6, 2016');
    this.fixture.detectChanges();
    de = this.fixture.debugElement.query(By.css('p.text-block--lg-font'));
    expect(de.nativeElement.textContent).toContain(
      `Your Recurring Gift was successfully created! Thank you for setting up a Recurring Gift.`
    );
    expect(de.nativeElement.textContent).toContain(
      `We will process your Recurring Gift of $56.78 for`
    );
    expect(de.nativeElement.textContent).toContain(
      `Programmer Caffination Fund on Every Tuesday.`
    );
    expect(de.nativeElement.textContent).toContain(
      `Your statement will be sent to user@test.com.`
    );
  });

  it('should show thank you for one time gift', () => {
    this.component.gift.type = 'donation';
    this.component.gift.amount = 90;
    this.component.gift.frequency  = 'One Time';
    this.fixture.detectChanges();
    de = this.fixture.debugElement.query(By.css('p.text-block--lg-font'));
    expect(de.nativeElement.textContent).toContain(`Thank you for your $90.00 gift to Programmer Caffination Fund.`);
  });

});
