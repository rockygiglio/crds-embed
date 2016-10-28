/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertModule, TabsModule, ButtonsModule, CollapseModule } from 'ng2-bootstrap/ng2-bootstrap';

import { PrototypePaymentComponent } from './prototype-payment.component';
import { PrototypeStore } from '../prototype-state/prototype.store';
import { PrototypeGiftService } from '../prototype-gift.service';

class MockPrototypeStore { public subscribe() {}; }

describe('Component: PrototypePayment', () => {

  let component;
  let fixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ PrototypePaymentComponent ],
      imports: [
        AlertModule,
        CollapseModule,
        ReactiveFormsModule,
        TabsModule
      ],
      providers:    [
        { provide: PrototypeStore, useClass: MockPrototypeStore },
        PrototypeGiftService
      ]
    });
    this.fixture = TestBed.createComponent(PrototypePaymentComponent);
    this.component = this.fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

});
