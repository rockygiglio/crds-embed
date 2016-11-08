import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Resolve } from '@angular/router';
import { HttpClientService } from './http-client.service';
import { UserSessionService } from './user-session.service';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class DonationService implements Resolve<number> {

    private transactionUrl = process.env.CRDS_API_ENDPOINT + 'api/donation';

    constructor (private http: HttpClientService,
                 private userSessionService: UserSessionService) {}

    resolve() {
         // return this.postPayment();
    }

    createBank() {
      try {
        donationService.bank = {
          country: 'US',
          currency: 'USD',
          routing_number: GiveTransferService.donor.default_source.routing,
          account_number: GiveTransferService.donor.default_source.bank_account_number,
          account_holder_name: GiveTransferService.donor.default_source.account_holder_name,
          account_holder_type: GiveTransferService.donor.default_source.account_holder_type
        };
      } catch(err) {
        throw new Error('Unable to create bank account');
      }

    }

    createCard() {
      try {
        donationService.card = {
          name: GiveTransferService.donor.default_source.name,
          number: GiveTransferService.donor.default_source.cc_number,
          exp_month: GiveTransferService.donor.default_source.exp_date.substr(0, 2),
          exp_year: GiveTransferService.donor.default_source.exp_date.substr(2, 2),
          cvc: GiveTransferService.donor.default_source.cvc,
          address_zip: GiveTransferService.donor.default_source.address_zip
        };
      } catch(err) {
        throw new Error('Unable to create credit card');
      }
    }

    createDonorAndDonate(programsInput) {
      var pgram;
      if (programsInput !== undefined) {
        pgram = _.find(programsInput, { ProgramId: GiveTransferService.program.ProgramId });
      } else {
        pgram = GiveTransferService.program;
      }

      if (GiveTransferService.view === 'cc') {
        donationService.createCard();
        PaymentService.createDonorWithCard(donationService.card, GiveTransferService.email, GiveTransferService.donorFirstName, GiveTransferService.donorLastName)
          .then(function (donor) {
            donationService.donate(pgram, GiveTransferService.campaign);
          }, PaymentService.stripeErrorHandler);
      } else if (GiveTransferService.view === 'bank') {
        donationService.createBank();
        PaymentService.createDonorWithBankAcct(donationService.bank, GiveTransferService.email, GiveTransferService.donorFirstName, GiveTransferService.donorLastName)
          .then(function (donor) {
            donationService.donate(pgram, GiveTransferService.campaign);
          }, PaymentService.stripeErrorHandler);
      }
    }    

    confirmDonation(programsInput, successful) {
      if (!Session.isActive()) {
        $state.go(GiveFlow.login);
      }

      GiveTransferService.processing = true;
      try {
        var pgram;
        if (programsInput) {
          pgram = _.find(programsInput, { ProgramId: GiveTransferService.program.ProgramId });
        } else {
          pgram = GiveTransferService.program;
        }

        donationService.donate(pgram, GiveTransferService.campaign, function(confirmation) {
          if (successful !== undefined) {
            successful(confirmation);
          }
          console.log('successfully donated');
        }, function(error) {

          if (GiveTransferService.declinedPayment) {
            GiveFlow.goToChange();
          }
        });
      } catch (DonationException) {
        GiveTransferService.processing = false;
        $rootScope.$emit('notify', $rootScope.MESSAGES.failedResponse);
      }
    }

    donate(program, campaign, onSuccess, onFailure) {
      if (campaign === undefined || campaign ===  null) {
        campaign = { campaignId: null,  campaignName: null };
      }

      PaymentService.donateToProgram(
          program.ProgramId,
          campaign.campaignId,
          GiveTransferService.amount,
          GiveTransferService.donor.donorId,
          GiveTransferService.email,
          GiveTransferService.view,
          GiveTransferService.anonymous,
          GiveTransferService.tripDeposit).then(function(confirmation) {
            GiveTransferService.amount = confirmation.amount;
            GiveTransferService.program = program;
            GiveTransferService.program_name = GiveTransferService.program.Name;
            GiveTransferService.email = confirmation.email;
            if (onSuccess !== undefined) {
              onSuccess(confirmation);
            }

            $state.go(GiveFlow.thankYou);
          }, function(error) {

            GiveTransferService.processing = false;
            PaymentService.stripeErrorHandler(error);
            if (onSuccess !== undefined && onFailure !== undefined) {
              onFailure(error);
            }
          });
    }

}
