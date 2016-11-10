/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { DatepickerModule } from 'ng2-bootstrap/ng2-bootstrap';

import { PrototypeDetailsComponent } from './prototype-details.component';
import { PrototypeStore } from '../prototype-state/prototype.store';
import { PrototypeGiftService } from '../prototype-gift.service';

import { ActivatedRoute } from '@angular/router';

class MockActivatedRoute {}
class MockPrototypeStore { public subscribe() {}; }

describe('Component: PrototypeDetails', () => {

  let component: any;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ PrototypeDetailsComponent ],
      imports: [
        ReactiveFormsModule,
        DatepickerModule
      ],
      providers:    [
        { provide: PrototypeStore, useClass: MockPrototypeStore },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        PrototypeGiftService
      ]
    });
    this.fixture = TestBed.createComponent(PrototypeDetailsComponent);
    this.component = this.fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });


});
