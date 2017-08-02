import { TestBed, inject } from '@angular/core/testing';

import { IFrameParentService } from './iframe-parent.service';
import { Observable } from 'rxjs/Observable'

import { AnalyticsService } from './analytics.service';
import { Angulartics2 } from 'angulartics2';

describe('AnalyticsService', () => {
  let mockAngulartics2Service;
  let mockIFrameParentService;

  class Angulartics2Stub {
    eventTrack = {
      next: jasmine.createSpy('next')
    };
  };

  beforeEach(() => {
    mockAngulartics2Service = new Angulartics2Stub();
    mockIFrameParentService = jasmine.createSpyObj<IFrameParentService>('iFrameParentService', ['getIFrameParentUrl']);
    TestBed.configureTestingModule({
      providers: [
        AnalyticsService,
        { provide: Angulartics2, useValue: mockAngulartics2Service },
        { provide: IFrameParentService, useValue: mockIFrameParentService }
      ]
    });
  });

  it('should create service', inject([AnalyticsService], (service: AnalyticsService) => {
    expect(service).toBeTruthy();
  }));

  describe('should remove protocol and subdomain from url', () => {
    it('should should strip (http://)', inject([AnalyticsService], (service: AnalyticsService) => {
      let result, url = 'http://somewebsite.com', expected = 'somewebsite.com';
      mockIFrameParentService.getIFrameParentUrl.and.returnValue(url)

      result = service['getParentUrlFormatted']();

      expect(result).toBe(expected);
    }));

    it('should should strip (http://, www.)', inject([AnalyticsService], (service: AnalyticsService) => {
      let result, url = 'http://www.somewebsite.com', expected = 'somewebsite.com';
      mockIFrameParentService.getIFrameParentUrl.and.returnValue(url)

      result = service['getParentUrlFormatted']();

      expect(result).toBe(expected);
    }));

    it('should should strip (www.)', inject([AnalyticsService], (service: AnalyticsService) => {
      let result, url = 'www.somewebsite.com', expected = 'somewebsite.com';
      mockIFrameParentService.getIFrameParentUrl.and.returnValue(url)

      result = service['getParentUrlFormatted']();

      expect(result).toBe(expected);
    }));

    it('should should strip (https://)', inject([AnalyticsService], (service: AnalyticsService) => {
      let result, url = 'https://somewebsite.com', expected = 'somewebsite.com';
      mockIFrameParentService.getIFrameParentUrl.and.returnValue(url)

      result = service['getParentUrlFormatted']();

      expect(result).toBe(expected);
    }));

    it('should should strip (https://www.)', inject([AnalyticsService], (service: AnalyticsService) => {
      let result, url = 'https://somewebsite.com', expected = 'somewebsite.com';
      mockIFrameParentService.getIFrameParentUrl.and.returnValue(url)

      result = service['getParentUrlFormatted']();

      expect(result).toBe(expected);
    }));
  });

  describe('analytics calls', () => {
    let website = 'somewebsite.com';
    beforeEach(inject([AnalyticsService], (service: AnalyticsService) => {
      spyOn(service, 'getParentUrlFormatted').and.returnValue(website);
    }));

    it('track GiveModalViewed', inject([AnalyticsService], (service: AnalyticsService) => {
      let callParams = { action: 'GiveModalViewed', properties: { Url: website } };
      service.giveModalViewed();
      expect(mockAngulartics2Service.eventTrack.next).toHaveBeenCalledWith(callParams);
    }));

    it('track giveAmountEntered', inject([AnalyticsService], (service: AnalyticsService) => {
      let amount = 999.99;
      let donationType = 'one time';
      let specificInitiative = 'general';
      let usedSuggested = false;      
      let callParams = { 
        action: 'GiveAmountEntered', 
        properties: { 
          Amount: amount,
          UsedSuggested: usedSuggested,
          DonationType: donationType,
          SpecificInitiative: specificInitiative,
          Url: website 
        } 
      };

      service.giveAmountEntered(amount, donationType, specificInitiative, usedSuggested);
      
      expect(mockAngulartics2Service.eventTrack.next).toHaveBeenCalledWith(callParams);
    }));

    it('track paymentDetailsEntered', inject([AnalyticsService], (service: AnalyticsService) => {
      let fundingMethod = 'abc';
      let email = 'def';
      let checkoutType = 'ghi';      
      let callParams = { 
        action: 'PaymentDetailsEntered', 
        properties: { 
          FundingMethod: fundingMethod,
          Url: website,
          Email: email,
          CheckoutType: checkoutType 
        } 
      };

      service.paymentDetailsEntered(fundingMethod, email, checkoutType);
      
      expect(mockAngulartics2Service.eventTrack.next).toHaveBeenCalledWith(callParams);
    }));

    it('track paymentSucceededClientSide', inject([AnalyticsService], (service: AnalyticsService) => {
      let fundingMethod = 'abc';
      let email = 'def';
      let checkoutType = 'ghi';   
      let amount = 999.99;   
      let callParams = { 
        action: 'PaymentSucceededClientSide', 
        properties: { 
          FundingMethod: fundingMethod,
          Url: website,
          Email: email,
          CheckoutType: checkoutType,
          Amount: amount
        } 
      };

      service.paymentSucceededClientSide(fundingMethod, email, checkoutType, amount);
      
      expect(mockAngulartics2Service.eventTrack.next).toHaveBeenCalledWith(callParams);
    }));
  });
});
