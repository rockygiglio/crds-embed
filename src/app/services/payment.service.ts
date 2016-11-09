import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Resolve } from '@angular/router';
import { HttpClientService } from './http-client.service';
import { UserSessionService } from './user-session.service';
import { StripeService } from './stripe.service';
import { CustomerBank } from '../classes/customer-bank';
import { CustomerCard} from '../classes/customer-card';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class PaymentService {

    //private transactionUrl = process.env.CRDS_API_ENDPOINT;
    public stripeApiMethodNames: any;
    private testApiEndpoint = 'https://gatewayint.crossroads.net/gateway/api/';
    private restMethodNames: any;
    public stripeMethods: any;

    // TODO set stripe KEY - teamcity needs var
    // stripe.setPublishableKey(process.env.STRIPE_PUBKEY);

    constructor(private http: Http,
                private userSessionService: UserSessionService,
                private httpClientService: HttpClientService,
                private stripeService: StripeService) {

        this.stripeApiMethodNames = {
            card:  'card',
            bankAccount: 'bankAccount'
        };

        this.restMethodNames = {
            post:  'POST',
            put: 'PUT'
        };

        this.stripeMethods = {
            card:  (<any>window).Stripe.card,
            bankAccount: (<any>window).Stripe.bankAccount
        };
    }

    // let requestOptions: any = this.httpClientService.getRequestOption();
    //
    // return this.http.get(this.getPreviousPmtUrl, requestOptions)
    //         .map(this.extractData)
    //         .catch(this.handleError);

    //test: sara.seissiger@ingagepartners.com
    getDonor(email): Observable<any> {

        let encodedEmail = email ? encodeURI(email).replace(/\+/g, '%2B') : '';

        let donorUrl = this.testApiEndpoint + 'donor/?email=' + encodedEmail;
        let requestOptions: any = this.httpClientService.getRequestOption();

        return this.http.get(donorUrl, requestOptions)
            .map(this.extractData)
            .catch(this.handleError);
    }

    makeApiDonorCall(donorInfo, email, firstName, lastName, stripeFunction, restMethod): Observable<any> {

        let donor = {
            stripe_token_id: donorInfo.id,
            email_address: email,
            first_name: firstName,
            last_name: lastName
        };

        let donorUrl = this.testApiEndpoint + 'donor/';
        let requestOptions: any = this.httpClientService.getRequestOption();

        if(restMethod === this.restMethodNames.post){
            return this.http.post(donorUrl, donor, requestOptions)
                .map(this.extractData)
                .catch(this.handleError);
        } else if (restMethod === this.restMethodNames.put){
            return this.http.put(donorUrl, donor, requestOptions)
                .map(this.extractData)
                .catch(this.handleError);
        }
    }


    createDonorWithBankAcct(bankAcct, email, firstName, lastName) {
        return this.apiDonor(bankAcct, email, firstName, lastName, this.stripeService.methodNames.bankAccount, 'POST');
    }

    createDonorWithCard(card, email, firstName, lastName) {
        return this.apiDonor(card, email, firstName, lastName, this.stripeService.methodNames.card, 'POST');
    }

    updateDonorWithBankAcct(donorId, bankAcct, email) {
        return this.apiDonor(bankAcct, email, null, null, this.stripeService.methodNames.bankAccount, 'PUT');
    }

    updateDonorWithCard(donorId, card, email) {
        return this.apiDonor(card, email, null, null, this.stripeService.methodNames.card, 'PUT');
    }


    apiDonor(donorInfo, email, firstName, lastName, stripeFunction, restMethod): Observable<any> {
        let observable  = new Observable(observer => {


            this.stripeService[stripeFunction](donorInfo).subscribe(
                value => {
                    console.log('Got stripe token: ');
                    console.log(value);
                    let crdsDonor = { stripe_token_id: value.id, email_address: email, first_name: firstName, last_name: lastName };
                    this.makeApiDonorCall(crdsDonor, email, firstName, lastName, stripeFunction, restMethod).subscribe(
                        value => {
                            console.log('Made API donor call');
                            console.log(value);
                        },
                        error => {
                            console.log('Failed to make API Donor call');
                        }
                    );
                    observer.next(value);
                },
                error => {
                    console.log('Observable call failed');
                },
                () => console.log('Done')
            );

            // this.getDonor(email).subscribe(
            //     donor => {
            //         this.makeApiDonorCall(donor, email, firstName, lastName, stripeFunction, restMethod);
            //         observer.next(donor);
            //     },
            //     error => {
            //         console.log('Donor call failed:');
            //     }
            // );

        });

        return observable;
    }

    //Make a call to the donor endpoint - method dependent on param

    //makeApiDonorCall('sara.seissiger@ingagepartners.com', 'Sara', 'Seissiger', 'post', donor);
    // makeApiDonorCall(email, firstName, lastName, apiMethod, apiDonor): Observable<any> {
    //
    //     console.log('Make api call called');
    //
    //     let observable  = new Observable(observer => {
    //
    //         let apiDonorResponse = function(status, response) {
    //             console.log('Call succeeded');
    //             observer.next(response);
    //         };
    //
    //         let donorError = function(res: Response | any) {
    //             console.log('Call failed!!!!!!!!!');
    //             return [[]];
    //         };
    //
    //         let donor = {
    //             stripe_token_id: apiDonor.id,
    //             email_address: email,
    //             first_name: firstName,
    //             last_name: lastName
    //         };
    //
    //         let donorUrl = this.testApiEndpoint + 'donor/';
    //         let requestOptions: any = this.httpClientService.getRequestOption();
    //
    //         console.log('MAKING CALL');
    //
    //         this.http.post(donorUrl, donor, requestOptions)
    //             .map(this.extractData)
    //             .catch(this.handleError);
    //
    //         console.log('MADE CALL');
    //     });
    //
    //     return observable;
    // }


    // apiDonor(donorInfo, email, firstName, lastName, stripeFunc, apiMethod): Observable<string> {
    //     let def = $q.defer();
    //
    //     stripeFunc.createToken(donorInfo, function (status, response) {
    //
    //         if (response.error) {
    //             def.reject(_addGlobalErrorMessage(response.error, status));
    //         } else {
    //
    //             //TODO - need this object - and add to it???
    //             let donorRequest = { stripe_token_id: response.id, email_address: email, first_name: firstName, last_name: lastName };
    //
    //             $http({
    //                 method: apiMethod,
    //                 url: this.transactionUrl + 'api/donor',
    //                 headers: {
    //                     Authorization: $cookies.get(cookieNames.SESSION_ID)
    //                 },
    //                 data: donorRequest
    //             }).success(function (data) {
    //                 this.donor = data;
    //                 def.resolve(data);
    //             }).error(function (response, statusCode) {
    //                 def.reject(_addGlobalErrorMessage(response.error, statusCode));
    //             });
    //
    //             return this.http.get(this.transactionUrl + 'api/donor')
    //                 .map(this.extractDonor)
    //                 .catch(this.errorDonor);
    //         }
    //
    //     });
    // }
    //
    // stripeErrorHandler(error) {
    //     if (error && error.globalMessage) {
    //         GiveTransferService.declinedPayment =
    //             error.globalMessage.id === $rootScope.MESSAGES.paymentMethodDeclined.id;
    //         $rootScope.$emit('notify', error.globalMessage);
    //     } else {
    //         $rootScope.$emit('notify', $rootScope.MESSAGES.failedResponse);
    //     }
    //
    //     GiveTransferService.processing = false;
    // }
    //

    // private extractDonorEmail(res: Response) {
    //     let body: any = res;
    //     return '';
    // }
    //
    // private errorDonorEmail(res: Response) {
    //     return [res.json()];
    // }

    private extractData(res: Response) {
        console.log('Call success');
        let body = res.json();
        return body;
    }

    private handleError (res: Response | any) {
        console.log('Call failure');
        return [[]];
    }

    // private extractDonor(res: Response) {
    //     let body: any = res;
    //     return '';
    // }
    //
    // private errorDonor(res: Response) {
    //     return [res.json()];
    // }

}
