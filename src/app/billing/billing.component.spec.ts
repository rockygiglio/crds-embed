/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BillingComponent } from './billing.component';
import { GiftService } from "../services/gift.service";
import { GivingStore } from "../giving-state/giving.store";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpModule, JsonpModule } from "@angular/http";
import { ReactiveFormsModule } from "@angular/forms";

class MockGivingStore { public subscribe() {}; }
class MockRouter { public navigate() {}; }

describe('BillingComponent', () => {
  let component: BillingComponent;
  let fixture: ComponentFixture<BillingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingComponent ],
      imports: [
        RouterTestingModule.withRoutes([]), HttpModule, JsonpModule, ReactiveFormsModule
      ],
      providers: [
        { provide: GivingStore, useClass: MockGivingStore },
        GiftService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
