import { Observable } from 'rxjs/Observable';
import { TestBed, async, inject } from '@angular/core/testing';

import { CustomerBank } from '../models/customer-bank';
import { CustomerCard } from '../models/customer-card';
import { StripeService } from './stripe.service';

describe('Service: Stripe', () => {

  const testCard = new CustomerCard('Bob Bobkinsons', 8888888888, 12, 17, 123, 125);
  const testBank = new CustomerBank('US', 'USD', 1234567, 12345689, 'Billy', 'individual');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        StripeService
      ]
    });

    TestBed.compileComponents();
  }));


  it('should return an observable when attempting to get card token from Stripe',
    inject([StripeService], (srvc) => {
      let stripeObservable: Observable<any> = srvc.getCardInfoToken(testCard);
      expect(stripeObservable.catch).toBeDefined();
    })
  );

  it('should return an observable when attempting to get bank token from Stripe',
    inject([StripeService], (srvc) => {
      let stripeObservable: Observable<any> = srvc.getBankInfoToken(testBank);
      expect(stripeObservable.catch).toBeDefined();
    })
  );

});
