/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { PrototypeStore } from './prototype-state/prototype.store';
import { PrototypeComponent } from './prototype.component';
import { PrototypeAmountComponent } from './prototype-amount/prototype-amount.component';

class MockPrototypeStore { public subscribe() {}; }
class MockRouter { public navigate() {}; }

describe('Component: Prototype', () => {

  let component;
  let fixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ PrototypeComponent ],
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      providers:    [
        { provide: PrototypeStore, useClass: MockPrototypeStore },
      ]
    });
    this.fixture = TestBed.createComponent(PrototypeComponent);
    this.component = this.fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

});
