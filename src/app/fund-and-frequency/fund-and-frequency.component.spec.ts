/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { DatepickerModule } from 'ng2-bootstrap/ng2-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';

import { FundAndFrequencyComponent } from './fund-and-frequency.component';
import { GiftService } from '../services/gift.service';

import { ActivatedRoute } from '@angular/router';

class MockActivatedRoute {}

describe('Component: FundAndFrequency', () => {

  let component: any;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ FundAndFrequencyComponent ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers:    [
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        GiftService
      ]
    });
    this.fixture = TestBed.createComponent(FundAndFrequencyComponent);
    this.component = this.fixture.componentInstance;
  });

  fit('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });


});
