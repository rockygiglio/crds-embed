/* tslint:disable:no-unused-variable */

import { async, inject, TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { GivingStore } from './giving-state/giving.store';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, JsonpModule } from '@angular/http';
import { GiftService } from './services/gift.service';
import { QuickDonationAmountsService } from './services/quick-donation-amounts.service';
import { PreviousGiftAmountService } from './services/previous-gift-amount.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientService } from './services/http-client.service';
import { UserSessionService } from './services/user-session.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';

class MockGivingStore { public subscribe() {}; }

describe('App: CrdsEmbed', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppComponent ],
      imports: [
        RouterTestingModule.withRoutes([]), HttpModule, JsonpModule, ReactiveFormsModule
      ],
      providers: [
        { provide: GivingStore, useClass: MockGivingStore },
        QuickDonationAmountsService,
        HttpClientService,
        PreviousGiftAmountService,
        UserSessionService,
        CookieService,
        GiftService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

});
