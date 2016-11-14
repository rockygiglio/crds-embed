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


