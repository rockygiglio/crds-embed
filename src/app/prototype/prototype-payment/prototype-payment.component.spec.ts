/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
<<<<<<< HEAD
import { AlertModule, TabsModule, ButtonsModule, CollapseModule } from 'ng2-bootstrap/ng2-bootstrap';
=======
import { AlertModule, ButtonsModule, TabsModule, CollapseModule } from 'ng2-bootstrap/ng2-bootstrap';
>>>>>>> 550e4e3a6d9dd63f210de1268eb7993218270d6b

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
        TabsModule,
        ButtonsModule
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
