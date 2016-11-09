import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Resolve } from '@angular/router';
import { HttpClientService } from './http-client.service';
import { UserSessionService } from './user-session.service';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class PaymentService {

    private transactionUrl = process.env.CRDS_API_ENDPOINT;

    // TODO set stripe KEY - teamcity needs var
    // stripe.setPublishableKey(process.env.STRIPE_PUBKEY);

    constructor(private http: HttpClientService,
        private userSessionService: UserSessionService) { }

    resolve() {
    }

    // getDonorOLD(email) {
    //     let encodedEmail = email ?
    //         encodeURI(email).replace(/\+/g, '%2B')
    //         :
    //         '';
    //     let def = $q.defer();
    //     $http({
    //         method: 'GET',
    //         url: this.transactionUrl + 'api/donor/?email=' + encodedEmail,
    //         headers: {
    //             Authorization: $cookies.get(cookieNames.SESSION_ID)
    //         }
    //     }).success(function (data) {
    //         def.resolve(data);
    //     }).error(function (response, statusCode) {
    //         def.reject(_addGlobalErrorMessage(response.error, statusCode));
    //     });

    //     return def.promise;
    // }

    getDonor(email): Observable<string> {
        let encodedEmail = email ?
            encodeURI(email).replace(/\+/g, '%2B')
            :
            '';

        return this.http.get(this.transactionUrl + 'api/donor/?email=' + encodedEmail)
            .map(this.extractDonorEmail)
            .catch(this.errorDonorEmail);
    }

    createDonorWithBankAcct(bankAcct, email, firstName, lastName) {
        return this.apiDonor(bankAcct, email, firstName, lastName, stripe.bankAccount, 'POST');
    }

    createDonorWithCard(card, email, firstName, lastName) {
        return this.apiDonor(card, email, firstName, lastName, stripe.card, 'POST');
    }

    updateDonorWithBankAcct(donorId, bankAcct, email) {
        return this.apiDonor(bankAcct, email, null, null, stripe.bankAccount, 'PUT');
    }

    updateDonorWithCard(donorId, card, email) {
        return this.apiDonor(card, email, null, null, stripe.card, 'PUT');
    }

    apiDonor(donorInfo, email, firstName, lastName, stripeFunc, apiMethod): Observable<string> {
        let def = $q.defer();
        stripeFunc.createToken(donorInfo, function (status, response) {
            if (response.error) {
                def.reject(_addGlobalErrorMessage(response.error, status));
            } else {

                //TODO - need this object - and add to it???
                let donorRequest = { stripe_token_id: response.id, email_address: email, first_name: firstName, last_name: lastName };

                // $http({
                //     method: apiMethod,
                //     url: this.transactionUrl + 'api/donor',
                //     headers: {
                //         Authorization: $cookies.get(cookieNames.SESSION_ID)
                //     },
                //     data: donorRequest
                // }).success(function (data) {
                //     this.donor = data;
                //     def.resolve(data);
                // }).error(function (response, statusCode) {
                //     def.reject(_addGlobalErrorMessage(response.error, statusCode));
                // });

                return this.http.get(this.transactionUrl + 'api/donor')
                    .map(this.extractDonor)
                    .catch(this.errorDonor);
            }
        });
    }

    stripeErrorHandler(error) {
        if (error && error.globalMessage) {
            GiveTransferService.declinedPayment =
                error.globalMessage.id === $rootScope.MESSAGES.paymentMethodDeclined.id;
            $rootScope.$emit('notify', error.globalMessage);
        } else {
            $rootScope.$emit('notify', $rootScope.MESSAGES.failedResponse);
        }

        GiveTransferService.processing = false;
    }

    private extractDonorEmail(res: Response) {
        let body: any = res;
        return '';
    }

    private errorDonorEmail(res: Response) {
        return [res.json()];
    }

    private extractDonor(res: Response) {
        let body: any = res;
        return '';
    }

    private errorDonor(res: Response) {
        return [res.json()];
    }

}
