/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { PrototypeAmountComponent } from './prototype-amount.component';
import { PrototypeStore } from '../prototype-state/prototype.store';
import { PrototypeGiftService } from '../prototype-gift.service';

import { ActivatedRoute } from '@angular/router';

class MockPrototypeStore { public subscribe() {}; }
class MockActivatedRoute { }

describe('Component: PrototypeAmount', () => {

  // let component;
  // let fixture;
  //
  // beforeEach(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ PrototypeAmountComponent ],
  //     imports: [
  //       ReactiveFormsModule
  //     ],
  //     providers:    [
  //       { provide: PrototypeStore, useClass: MockPrototypeStore },
  //       //{ provide: ActivatedRoute, useClass: MockActivatedRoute },
  //       PrototypeGiftService
  //     ]
  //   });
  //   this.fixture = TestBed.createComponent(PrototypeAmountComponent);
  //   this.component = this.fixture.componentInstance;
  // });
  //
  // it('should create an instance', () => {
  //   expect(this.component).toBeTruthy();
  // });

});
