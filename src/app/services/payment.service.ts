import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpClientService } from './http-client.service';
import { StripeService } from './stripe.service';
import { CustomerBank } from '../models/customer-bank';
import { CustomerCard} from '../models/customer-card';
import { PaymentCallBody } from '../models/payment-call-body';
import { CrdsDonor } from '../models/crds-donor';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class PaymentService {

    private restMethodNames: any;
    private baseUrl = process.env.CRDS_API_ENDPOINT;

    constructor(private http: Http,
                private httpClient: HttpClientService,
                private stripeService: StripeService) {

        this.restMethodNames = {
            post:  'POST',
            put: 'PUT'
        };
    }

    getDonor(): Observable<any> {
        let donorUrl = this.baseUrl + 'api/donor';

        return this.httpClient.get(donorUrl)
            .map(this.extractData);
    };

    createDonorWithBankAcct(bankAcct: CustomerBank, email: string, firstName: string, lastName: string): Observable<any> {
        return this.apiDonor(bankAcct, email, firstName, lastName, this.stripeService.methodNames.bankAccount, this.restMethodNames.post);
    };

    createDonorWithCard(card: CustomerCard, email: string, firstName: string, lastName: string): Observable<any> {
        return this.apiDonor(card, email, firstName, lastName, this.stripeService.methodNames.card, this.restMethodNames.post);
    };

    updateDonorWithBankAcct(donorId: number, bankAcct: CustomerBank, email: string): Observable<any> {
        return this.apiDonor(bankAcct, email, null, null, this.stripeService.methodNames.bankAccount, this.restMethodNames.put);
    };

    updateDonorWithCard(donorId: number, card: CustomerCard, email: string): Observable<any> {
        return this.apiDonor(card, email, null, null, this.stripeService.methodNames.card, this.restMethodNames.put);
    };

    /**
     * Send the donor's information to stripe to receive a donor Id, then make a call to the Crossroad Gateway API's
     * 'Donor' endpoint to either save or update the donor.
     * @param {Number} BankOrCcPmtInfo - either bank or credit card information entered by the user (will be passed to stripe)
     * @param {Number} email
     * @param {Number} firstName
     * @param {Number} lastName
     * @param {Number} stripeFunction - name of function to call on stripe API helper - either 'getBankInfoToken' or 'getCardInfoToken'
     * @param {Number} restMethod - the REST API method to call on Crossroads Gatewat - PUT or POST
     * @return {Number} ??? user infomation
     */
    apiDonor(BankOrCcPmtInfo: CustomerBank | CustomerCard,
             email: string,
             firstName: string,
             lastName: string,
             stripeFunction: string,
             restMethod: string): Observable<any> {
        let observable  = new Observable(observer => {


            this.stripeService[stripeFunction](BankOrCcPmtInfo).subscribe(
                stripeEncryptedPmtInfo => {

                    let crdsDonor = new CrdsDonor(stripeEncryptedPmtInfo.id, email, firstName, lastName);

                    this.makeApiDonorCall(crdsDonor, email, firstName, lastName, restMethod).subscribe(
                        value => {
                            observer.next(value);
                        },
                        error => {
console.log('PaymentService, makeApiDonorCall just setting observer.error - ERROR - ??');
console.log(error);



                            observer.error(error);
                        }
                    );
                },
                errorOuter => {
console.log('PaymentService, makeApiDonorCall just setting observer.error - OUTER');
console.log(errorOuter);
                observer.error(errorOuter);
                }
            );

        });

        return observable;
    };

    makeApiDonorCall(donorInfo: CrdsDonor, email: string, firstName: string, lastName: string, restMethod: string): Observable<any> {
        let donorUrl = this.baseUrl + 'api/donor';
        let requestOptions: any = this.httpClient.getRequestOption();

        if (restMethod === this.restMethodNames.post) {
            return this.http.post(donorUrl, donorInfo, requestOptions)
                .map(this.extractData)
                .catch(this.handleError);
        } else if (restMethod === this.restMethodNames.put) {
            return this.http.put(donorUrl, donorInfo, requestOptions)
                .map(this.extractData)
                .catch(this.handleError);
        }
    };

    postPayment(paymentInfo: PaymentCallBody): Observable<any> {

        let url: string = this.baseUrl + 'api/donation';

        return this.httpClient.post(url, paymentInfo)
            .map(this.extractData);
    };

    private extractData(res: Response) {
        return res;
    };

    private handleError (err: Response | any) {
console.log('handle Error in catch of makeApiDonorCall !!');
       return Observable.throw(err);
      };

}
