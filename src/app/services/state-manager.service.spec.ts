/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StateManagerService } from './state-manager.service';
import { CookieService } from 'angular2-cookie/core';

describe('Service: StateManagerSession', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StateManagerService]
    });
  });

  it('should create an instance', inject([StateManagerService], (service: any) => {
      expect(service).toBeTruthy();
  }));

  it('should set state to hide', inject([StateManagerService], (service: any) => {
      service.paymentState = [
          { path: '/payment', show: true },
          { path: '/auth', show: true },
          { path: '/billing', show: true },
          { path: '/summary', show: true },
          { path: '/confirmation', show: true }
      ];
      service.hidePage(1);
      expect(service.paymentState[1].show).toBe(false);
  }));

  it('should set state to show', inject([StateManagerService], (service: any) => {
      service.paymentState = [
          { path: '/payment', show: true },
          { path: '/auth', show: false },
          { path: '/billing', show: true },
          { path: '/summary', show: true },
          { path: '/confirmation', show: true }
      ];
      service.unhidePage(1);
      expect(service.paymentState[1].show).toBe(true);
  }));

  it('should get next page to show', inject([StateManagerService], (service: any) => {
      service.paymentState = [
          { path: '/payment', show: true },
          { path: '/auth', show: false },
          { path: '/billing', show: false },
          { path: '/summary', show: true },
          { path: '/confirmation', show: true }
      ];
      expect(service.getNextPageToShow(0)).toBe('/summary');
  }));

  it('should get prev page to show', inject([StateManagerService], (service: any) => {
      service.paymentState = [
          { path: '/payment', show: true },
          { path: '/auth', show: false },
          { path: '/billing', show: false },
          { path: '/summary', show: true },
          { path: '/confirmation', show: true }
      ];
      expect(service.getPrevPageToShow(3)).toBe('/payment');
  }));

  it('should get page', inject([StateManagerService], (service: any) => {
      service.paymentState = [
          { path: '/payment', show: true },
          { path: '/auth', show: false },
          { path: '/billing', show: false },
          { path: '/summary', show: true },
          { path: '/confirmation', show: true }
      ];
      expect(service.getPage(2)).toBe('/billing');
  }));

});
