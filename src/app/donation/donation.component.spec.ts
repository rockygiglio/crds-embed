/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DonationComponent } from './donation.component';
import { HttpModule, JsonpModule  } from '@angular/http';
import { GiftService } from '../services/gift.service';

class MockPrototypeStore { public subscribe() {}; }
class MockRouter { public navigate() {}; }

describe('Component: Payment', () => {

  let component;
  let fixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ DonationComponent ],
      imports: [
        RouterTestingModule.withRoutes([]), HttpModule, JsonpModule
      ],
      providers: [
        GiftService
      ]
    });
    this.fixture = TestBed.createComponent(DonationComponent);
    this.component = this.fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

});
