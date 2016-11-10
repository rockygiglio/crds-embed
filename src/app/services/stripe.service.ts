import { Observable } from 'rxjs/Observable';
import { CustomerBank } from '../classes/customer-bank';
import { CustomerCard} from '../classes/customer-card';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

export class StripeService {

    public methodNames = {
        card: 'getCardInfoToken',
        bankAccount: 'getBankInfoToken'
    };

    constructor () {}

    public getCardInfoToken(customerCard: CustomerCard) {
        let observable  = new Observable(observer => {

            let stripeResponseHandler = function(status, response) {
                console.log('Got stripe token');
                observer.next(response);
            };

            (<any>window).Stripe.card.createToken(customerCard, stripeResponseHandler);

        });

        return observable;
    }

    public getBankInfoToken(customerBank: CustomerBank) {
        let observable  = new Observable(observer => {

            let stripeResponseHandler = function(status, response) {
                console.log('Got stripe token');
                observer.next(response);
            };

            (<any>window).Stripe.bankAccount.createToken(customerBank, stripeResponseHandler);

        });

        return observable;
    }
}


//TODO Remove testing data
/*
 let card: CustomerCard = new CustomerCard('mpcrds+20@gmail.com', 4242424242424242, 12, 17, 123, 12345);
 let bank: CustomerBank = new CustomerBank('US', 'USD', 110000000, parseInt('000123456789', 10), 'Jane Austen', 'individual');
*/