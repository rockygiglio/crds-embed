/* tslint:disable:no-unused-variable */

import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { DatepickerModule } from 'ng2-bootstrap/ng2-bootstrap';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';

import { ContentService } from '../services/content.service';
import { IFrameParentService } from '../services/iframe-parent.service';
import { FundAndFrequencyComponent } from './fund-and-frequency.component';
import { Frequency } from '../models/frequency';
import { StoreService } from '../services/store.service';
import { SessionService } from '../services/session.service';
import { ValidationService } from '../services/validation.service';
import { APIService } from '../services/api.service';
import { Fund } from '../models/fund';
import { StateService } from '../services/state.service';


class MockActivatedRoute {
  public snapshot = {
    queryParams: []
  };
}

describe('Component: FundAndFrequency', () => {

  let component: any;
  let currentDateTime: Date = new Date();
  let currentDateTime2: Date = undefined;
  let fixture: any;

  let giveFrequencies: any = {
    oneTime: new Frequency('One Time', 'once', false),
    weekly: new Frequency('Weekly', 'week', true),
    monthly: new Frequency('Monthly', 'month', true)
  };

  let mockFund: Fund = new Fund(5, 'General Giving', 1, true);
  let mockOneTimeGiftFund: Fund = new Fund(5, 'General Giving', 1, false);

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FundAndFrequencyComponent
      ],
      imports: [
        DatepickerModule,
        HttpModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        CookieService,
        IFrameParentService,
        StoreService,
        SessionService,
        ValidationService,
        APIService,
        ContentService,
        StateService
      ]
    });
    this.fixture = TestBed.createComponent(FundAndFrequencyComponent);
    this.component = this.fixture.componentInstance;
  });

  it('should reset the date to the current date time', () => {
    currentDateTime2 = new Date();
    this.component.store.startDate = new Date();

    expect(this.component.store.startDate.toString()).toBe(currentDateTime2.toString());
  });

  it('should set the gift fund object to whatever fund is passed in', () => {
    this.component.store.fund = undefined;
    this.component.onClickFund(mockFund);

    expect(this.component.store.fund.ID).toBe(mockFund.ID);
  });

  it('should set frequency for the fund IF it allows re-occurring gifts', () => {
    this.component.onClickFund(mockFund);
    this.component.onClickFrequency(giveFrequencies.weekly);

    expect(this.component.store.frequency.value).toBe(giveFrequencies.weekly.value);
  });

  it('should NOT set frequency for the fund to anything other than "once" if it does not allow reoccurring', () => {
    this.component.onClickFund(mockOneTimeGiftFund);
    this.component.onClickFrequency(giveFrequencies.weekly);

    expect(this.component.store.frequency.value).toBe(giveFrequencies.oneTime.value);
  });


  describe('#Frequency model', () => {
    it('should create an array of default frequencies for recurring giving', () => {
      expect(this.component.store.frequencies.length).toBeGreaterThan(0);
      expect(this.component.store.getFirstNonRecurringFrequency().value).toBe('once');
    });

  });

});
