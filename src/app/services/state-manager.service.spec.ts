/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StateManagerService } from './state-manager.service';
import { CookieService } from 'angular2-cookie/core';

describe('Service: UserSession', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StateManagerService]
    });
  });

  it('should create an instance', inject([StateManagerService], (service: any) => {
    expect(service).toBeTruthy();
  }));

});
