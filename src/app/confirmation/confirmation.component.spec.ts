/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { ConfirmationComponent } from './confirmation.component';
import { HttpModule, JsonpModule  } from '@angular/http';
import { StoreService } from '../services/store.service';
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
class MockStoreService {
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
  public validateRoute(router: any) { }
}
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
        { provide: StoreService, useClass: MockStoreService },
        StateManagerService,
        ParamValidationService
      ]
    });
    this.fixture = TestBed.createComponent(ConfirmationComponent);
    this.component = this.fixture.componentInstance;
    this.component.store.email = 'user@test.com';
    this.component.store.fund = {
      'ProgramId': 12,
      'Name': 'Programmer Caffination Fund',
      'ProgramType': 1,
      'AllowRecurringGiving': true
    };

  });

  it('should show thank you for payment', () => {
    this.component.store.type = 'payment';
    this.component.store.amount = 12.34;
    this.component.store.title = 'frankincense and myrrh';
    this.fixture.detectChanges();
    de = this.fixture.debugElement.query(By.css('p.text-block--lg-font'));
    expect(de.nativeElement.textContent).toContain(`Thank you for the $12.34 payment for frankincense and myrrh.`);
  });

  it('should show thank you for monthly recurring gift', () => {
    this.component.store.type = 'donation';
    this.component.store.amount = 56.78;
    this.component.store.frequency = 'month';
    this.component.store.start_date = new Date('December 6, 2016');
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
    this.component.store.type = 'donation';
    this.component.store.amount = 56.78;
    this.component.store.frequency = 'Weekly';
    this.component.store.start_date = new Date('December 6, 2016');
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
    this.component.store.type = 'donation';
    this.component.store.amount = 90;
    this.component.store.frequency  = 'One Time';
    this.fixture.detectChanges();
    de = this.fixture.debugElement.query(By.css('p.text-block--lg-font'));
    expect(de.nativeElement.textContent).toContain(`Thank you for your $90.00 gift to Programmer Caffination Fund.`);
  });

});
