import { Observable } from 'rxjs/Observable';
import { CustomerBank } from '../models/customer-bank';
import { CustomerCard} from '../models/customer-card';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

export class StripeService {

    public methodNames = {
        card: 'getCardInfoToken',
        bankAccount: 'getBankInfoToken'
    };

    constructor () {
    }

    public getCardInfoToken(customerCard: CustomerCard) {
        let observable  = new Observable(observer => {

            let stripeResponseHandler = function(status, response) {
                observer.next(response);
                observer.error(new Error('Error getting stripe token, cc'));
            };

            (<any>window).Stripe.card.createToken(customerCard, stripeResponseHandler);

        });

        return observable;
    }

    public getBankInfoToken(customerBank: CustomerBank) {
        let observable  = new Observable(observer => {

            let stripeResponseHandler = function(status, response) {
                observer.next(response);
                observer.error(new Error('Error getting stripe token, ach'));
            };

            (<any>window).Stripe.bankAccount.createToken(customerBank, stripeResponseHandler);

        });

        return observable;
    }
}


