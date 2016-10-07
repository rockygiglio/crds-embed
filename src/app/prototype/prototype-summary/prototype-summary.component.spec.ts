/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { PrototypeSummaryComponent } from './prototype-summary.component';
import { PrototypeStore } from '../prototype-state/prototype.store';
import { PrototypeGiftService } from '../prototype-gift.service';

class MockPrototypeStore { public subscribe() {}; }

describe('Component: PrototypeSummary', () => {

  let component;
  let fixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ PrototypeSummaryComponent ],
      imports: [
        ReactiveFormsModule
      ],
      providers:    [
        { provide: PrototypeStore, useClass: MockPrototypeStore },
        PrototypeGiftService
      ]
    });
    this.fixture = TestBed.createComponent(PrototypeSummaryComponent);
    this.component = this.fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

});
