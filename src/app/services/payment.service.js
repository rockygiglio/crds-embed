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

    getDonor(email) {
        var encodedEmail = email ?
            encodeURI(email).replace(/\+/g, '%2B')
            :
            '';
        var def = $q.defer();
        $http({
            method: 'GET',
            url: this.transactionUrl + 'api/donor/?email=' + encodedEmail,
            headers: {
                Authorization: $cookies.get(cookieNames.SESSION_ID)
            }
        }).success(function (data) {
            def.resolve(data);
        }).error(function (response, statusCode) {
            def.reject(_addGlobalErrorMessage(response.error, statusCode));
        });

        return def.promise;
    }

    updateDonorWithBankAcct(donorId, bankAcct, email) {
        return this.apiDonor(bankAcct, email, null, null, stripe.bankAccount, 'PUT');
    }

    updateDonorWithCard(donorId, card, email) {
        return this.apiDonor(card, email, null, null, stripe.card, 'PUT');
    }

    apiDonor(donorInfo, email, firstName, lastName, stripeFunc, apiMethod) {
        var def = $q.defer();
        stripeFunc.createToken(donorInfo, function (status, response) {
            if (response.error) {
                def.reject(_addGlobalErrorMessage(response.error, status));
            } else {
                var donorRequest = { stripe_token_id: response.id, email_address: email, first_name: firstName, last_name: lastName };
                $http({
                    method: apiMethod,
                    url: this.transactionUrl + 'api/donor',
                    headers: {
                        Authorization: $cookies.get(cookieNames.SESSION_ID)
                    },
                    data: donorRequest
                }).success(function (data) {
                    this.donor = data;
                    def.resolve(data);
                }).error(function (response, statusCode) {
                    def.reject(_addGlobalErrorMessage(response.error, statusCode));
                });
            }
        });

        return def.promise;
    }

    createDonorWithBankAcct(bankAcct, email, firstName, lastName) {
        return this.apiDonor(bankAcct, email, firstName, lastName, stripe.bankAccount, 'POST');
    }

    createDonorWithCard(card, email, firstName, lastName) {
        return this.apiDonor(card, email, firstName, lastName, stripe.card, 'POST');
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

}
