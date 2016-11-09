import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CustomerBank } from '../classes/customer-bank';
import { CustomerCard} from '../classes/customer-card';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class StripeService {

    public methodNames = {
        card: 'getCardInfoToken',
        bankAccount: 'getBankInfoToken'
    };

    constructor () {}

    public getCardInfoToken(customerCard: CustomerCard) {
        let observable  = new Observable(observer => {

            let stripeResponseHandler = function(status, response) {
                observer.next(response);
            };

            (<any>window).Stripe.card.createToken(customerCard, stripeResponseHandler);

        });

        return observable;
    }

    public getBankInfoToken(customerBank: CustomerBank) {
        let observable  = new Observable(observer => {

            let stripeResponseHandler = function(status, response) {
                observer.next(response);
            };

            (<any>window).Stripe.bankAccount.createToken(customerBank, stripeResponseHandler);

        });

        return observable;
    }
}

/* Test code, use during implementation:

import { StripeService } from '../services/stripe.service';
import { CustomerBank } from '../classes/customer-bank';
import { CustomerCard} from '../classes/customer-card';

private stripeService: StripeService, //in constructor args

this.test(); //run test function on init

test() {
    console.log('Test function called');

    //Test vars
    let card: CustomerCard = new CustomerCard('mpcrds+20@gmail.com', 4242424242424242, 12, 17, 123, 12345);
    let bank: CustomerBank = new CustomerBank('US', 'USD', 110000000, parseInt('000123456789', 10), 'Jane Austen', 'individual');

    this.stripeService.getCardInfoToken(card).subscribe(
        value => {
            console.log('GOT OBSERVABLE CARD RESULT: ');
            console.log(value);
        },
        error => 'Observable failed',
        () => console.log('Done')
    );

    this.stripeService.getBankInfoToken(bank).subscribe(
        value => {
            console.log('GOT OBSERVABLE BANK RESULT: ');
            console.log(value);
        },
        error => 'Observable failed',
        () => console.log('Done')
    );
} */