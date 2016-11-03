/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PaymentComponent } from './payment.component';
import { HttpModule, JsonpModule  } from '@angular/http';
import { ParameterService } from '../services/parameter.service';

class MockPrototypeStore { public subscribe() {}; }
class MockRouter { public navigate() {}; }

describe('Component: Payment', () => {

  let component;
  let fixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentComponent ],
      imports: [
        RouterTestingModule.withRoutes([]), HttpModule, JsonpModule
      ],
      providers:    [ ParameterService ]
    });
    this.fixture = TestBed.createComponent(PaymentComponent);
    this.component = this.fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

});
