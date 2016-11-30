/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { PrototypeEmailComponent } from './prototype-email.component';
import { PrototypeStore } from '../prototype-state/prototype.store';
import { PrototypeGiftService } from '../prototype-gift.service';

class MockPrototypeStore { public subscribe() {}; }

describe('Component: PrototypeEmail', () => {

  let component: any;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ PrototypeEmailComponent ],
      imports: [
        ReactiveFormsModule
      ],
      providers:    [
        { provide: PrototypeStore, useClass: MockPrototypeStore },
        PrototypeGiftService
      ]
    });
    this.fixture = TestBed.createComponent(PrototypeEmailComponent);
    this.component = this.fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

});
