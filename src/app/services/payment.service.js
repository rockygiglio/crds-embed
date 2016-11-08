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
    private transactionUrl = process.env.CRDS_API_ENDPOINT + 'api/donation';

    constructor (private http: HttpClientService,
                 private userSessionService: UserSessionService) {}    

    stripe.setPublishableKey(__STRIPE_PUBKEY__);

    createDonorWithBankAcct(bankAcct, email, firstName, lastName) {
      return apiDonor(bankAcct, email, firstName, lastName, stripe.bankAccount, 'POST');
    }

    createDonorWithCard(card, email, firstName, lastName) {
      return apiDonor(card, email, firstName, lastName, stripe.card, 'POST');
    }    
    
    getDonor(email) {
      var encodedEmail = email ?
          encodeURI(email).replace(/\+/g, '%2B')
          :
          '';
      var def = $q.defer();
      $http({
        method: 'GET',
        url: __API_ENDPOINT__ + 'api/donor/?email=' + encodedEmail,
        headers: {
          Authorization: $cookies.get(cookieNames.SESSION_ID)
        }
      }).success(function(data) {
        def.resolve(data);
      }).error(function(response, statusCode) {
        def.reject(_addGlobalErrorMessage(response.error, statusCode));
      });

      return def.promise;
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

    updateDonorWithBankAcct(donorId, bankAcct, email) {
      return apiDonor(bankAcct, email, null, null, stripe.bankAccount, 'PUT');
    }

    updateDonorWithCard(donorId, card, email) {
      return apiDonor(card, email, null, null, stripe.card, 'PUT');
    }

    _addGlobalErrorMessage(error, httpStatusCode) {
      var e = error ? error : {};
      e.httpStatusCode = httpStatusCode;

      if (e.globalMessage && e.globalMessage > 0) {
        // Short-circuit the logic below, as the API should have
        // already determined the message to display
        return e;
      }

      // This same logic exists on the .Net side in crds-angular/Services/StripeService.cs
      // This is because of the Stripe "tokens" call, which goes directly to Stripe, not via our API.  We
      // are implementing the same here in the interest of keeping our application somewhat agnostic to
      // the underlying payment processor.
      if (e.type === 'abort' || e.code === 'abort') {
        e.globalMessage = MESSAGES.paymentMethodProcessingError;
      } else if (e.type === 'card_error') {
        return processCardError(e);
      } else if (e.param === 'bank_account') {
        if (e.type === 'invalid_request_error') {
          e.globalMessage = MESSAGES.paymentMethodDeclined;
        }
      }

      return e;
    }

    processCardError(e) {
      if (e.code === 'card_declined' ||
          /^incorrect/.test(e.code) ||
          /^invalid/.test(e.code)) {
        e.globalMessage = MESSAGES.paymentMethodDeclined;
      } else if (e.code === 'processing_error') {
        e.globalMessage = MESSAGES.paymentMethodProcessingError;
      }

      return e;
    }

    apiDonor(donorInfo, email, firstName, lastName, stripeFunc, apiMethod) {
      var def = $q.defer();
      stripeFunc.createToken(donorInfo, function(status, response) {
        if (response.error) {
          def.reject(_addGlobalErrorMessage(response.error, status));
        } else {
          var donorRequest = { stripe_token_id: response.id, email_address: email, first_name: firstName, last_name: lastName };
          $http({
            method: apiMethod,
            url: __API_ENDPOINT__ + 'api/donor',
            headers: {
              Authorization:  $cookies.get(cookieNames.SESSION_ID)
            },
            data: donorRequest
          }).success(function(data) {
            paymentService.donor = data;
            def.resolve(data);
          }).error(function(response, statusCode) {
            def.reject(_addGlobalErrorMessage(response.error, statusCode));
          });
        }
      });

      return def.promise;
    }

}
