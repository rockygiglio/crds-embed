/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { ConfirmationComponent } from './confirmation.component';
import { GiftService } from '../services/gift.service';

class MockPrototypeStore { public subscribe() {}; }

describe('Component: PrototypeConfirmation', () => {

  let component: any;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationComponent ],
      imports: [
        ReactiveFormsModule
      ],
      providers:    [
       GiftService
      ]
    });
    this.fixture = TestBed.createComponent(ConfirmationComponent);
    this.component = this.fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

});
