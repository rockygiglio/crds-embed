/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'angular2-cookie/core';

import { ConfirmationComponent } from './confirmation.component';
import { ContentService } from '../services/content.service';
import { HttpModule, JsonpModule  } from '@angular/http';
import { IFrameParentService } from '../services/iframe-parent.service';
import { StoreService } from '../services/store.service';
import { ValidationService } from '../services/validation.service';
import { APIService } from '../services/api.service';
import { StateService } from '../services/state.service';
import { SessionService } from '../services/session.service';

import { Frequency } from '../models/frequency';
import { Fund } from '../models/fund';

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
      providers: [
        IFrameParentService,
        StoreService,
        StateService,
        ValidationService,
        APIService,
        SessionService,
        CookieService,
        ContentService
      ]
    });
    this.fixture = TestBed.createComponent(ConfirmationComponent);
    this.component = this.fixture.componentInstance;
    this.component.store.email = 'user@test.com';
    this.component.store.fund = new Fund(12, 'Programmer Caffination Fund', 1, true);
  });

  it('should show thank you for payment', () => {
    this.component.store.type = 'payment';
    this.component.store.amount = 12.34;
    this.component.store.title = 'frankincense and myrrh';
    spyOn(this.component.store.content, 'getContent');
    this.component.ngOnInit();
    expect(this.component.store.content.getContent).toHaveBeenCalledWith('embedConfirmationPaymentBody');
    expect(this.component.store.content.getContent).toHaveBeenCalledWith('embedConfirmationPaymentReceipt');
  });

  it('should show thank you for monthly recurring gift', () => {
    this.component.store.type = 'donation';
    this.component.store.amount = 56.78;
    this.component.store.frequency = new Frequency('month', 'month', true);
    this.component.store.startDate = new Date('December 6, 2016');
    spyOn(this.component.store.content, 'getContent');
    this.component.ngOnInit();
    expect(this.component.store.content.getContent).toHaveBeenCalledWith('embedConfirmationRecurringBody');
    expect(this.component.store.content.getContent).toHaveBeenCalledWith('embedConfirmationRecurringStatement');
  });

  it('should show thank you for weekly recurring gift', () => {
    this.component.store.type = 'donation';
    this.component.store.amount = 56.78;
    this.component.store.frequency = new Frequency('weekly', 'week', true);
    this.component.store.startDate = new Date('December 6, 2016');
    spyOn(this.component.store.content, 'getContent');
    this.component.ngOnInit();
    expect(this.component.store.content.getContent).toHaveBeenCalledWith('embedConfirmationRecurringBody');
    expect(this.component.store.content.getContent).toHaveBeenCalledWith('embedConfirmationRecurringStatement');
  });

  it('should show thank you for one time gift', () => {
    this.component.store.type = 'donation';
    this.component.store.amount = 90;
    this.component.store.frequency = new Frequency('One Time', 'once', false);
    this.component.store.startDate = new Date('December 6, 2016');
    spyOn(this.component.store.content, 'getContent');
    this.component.ngOnInit();
    expect(this.component.store.content.getContent).toHaveBeenCalledWith('embedConfirmationOneTimeBody');
    expect(this.component.store.content.getContent).toHaveBeenCalledWith('embedConfirmationOneTimeStatement');
  });

});
