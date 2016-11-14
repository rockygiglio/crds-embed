import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpClientService } from './http-client.service';
import { StripeService } from './stripe.service';
import { CustomerBank } from '../classes/customer-bank';
import { CustomerCard} from '../classes/customer-card';
import { PaymentCallBody } from '../classes/payment-call-body';
import { CrdsDonorWithoutId } from '../classes/crds-donor-without-id';

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

    //Get Crds Donor by email
    getDonor(email): Observable<any> {

        let encodedEmail = email ? encodeURI(email).replace(/\+/g, '%2B') : '';

        let donorUrl = this.baseUrl + 'donor/?email=' + encodedEmail;
        let requestOptions: any = this.httpClient.getRequestOption();

        return this.http.get(donorUrl, requestOptions)
            .map(this.extractData)
            .catch(this.handleError);
    }


    createDonorWithBankAcct(bankAcct, email, firstName, lastName) {
        return this.apiDonor(bankAcct, email, firstName, lastName, this.stripeService.methodNames.bankAccount, this.restMethodNames.post);
    }

    createDonorWithCard(card, email, firstName, lastName) {
        return this.apiDonor(card, email, firstName, lastName, this.stripeService.methodNames.card, this.restMethodNames.post);
    }

    updateDonorWithBankAcct(donorId, bankAcct, email) {
        return this.apiDonor(bankAcct, email, null, null, this.stripeService.methodNames.bankAccount, this.restMethodNames.put);
    }

    updateDonorWithCard(donorId, card, email) {
        return this.apiDonor(card, email, null, null, this.stripeService.methodNames.card, this.restMethodNames.put);
    }

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

                    let crdsDonor = new CrdsDonorWithoutId(stripeEncryptedPmtInfo.id, email, firstName, lastName);

                    this.makeApiDonorCall(crdsDonor, email, firstName, lastName, restMethod).subscribe(
                        value => {
                            observer.next(value);
                        },
                        error => {
                            observer.error(error);
                        }
                    );
                },
                error => {
                }
            );

        });

        return observable;
    }

    makeApiDonorCall(donorInfo, email, firstName, lastName, restMethod): Observable<any> {

        let crdsDonor = new CrdsDonorWithoutId(donorInfo.id, email, firstName, lastName);

        let donorUrl = this.baseUrl + 'donor/';
        let requestOptions: any = this.httpClient.getRequestOption();

        if (restMethod === this.restMethodNames.post) {
            return this.http.post(donorUrl, crdsDonor, requestOptions)
                .map(this.extractData)
                .catch(this.handleError);
        } else if (restMethod === this.restMethodNames.put){
            return this.http.put(donorUrl, crdsDonor, requestOptions)
                .map(this.extractData)
                .catch(this.handleError);
        }
    }

    postPayment(paymentInfo: PaymentCallBody): Observable<any> {

        let url: string = this.baseUrl + 'api/donation';

        return this.httpClient.post(url, paymentInfo)
            .map(this.extractPostPmtData)
            .catch(this.handleError);

    }

    private extractPostPmtData(res: Response) {
        return res;
    }

    private extractData(res: Response) {
        let body = res.json();
        return body;
    }

    private handleError (res: Response | any) {
        return [[]];
    }

}
