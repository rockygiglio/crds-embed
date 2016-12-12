import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreditCardValidator } from '../validators/credit-card.validator';
import { CustomerBank } from '../models/customer-bank';
import { CustomerCard } from '../models/customer-card';
import { GiftService } from '../services/gift.service';
import { StripeService } from '../services/stripe.service';
import { PaymentService } from '../services/payment.service';
import { StateManagerService } from '../services/state-manager.service';

@Component({
    selector: 'app-billing',
    templateUrl: './billing.component.html',
    styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
    achForm: FormGroup;
    ccForm: FormGroup;
    hideCheck: boolean = true;
    achSubmitted = false;
    ccSubmitted = false;
    userToken = null;
    accountNumberPlaceholder = 'Account Number';

    errorMessage: string = 'The following fields are in error:';
    errorMessageACH: string = '';
    errorMessageCC: string = '';

    constructor(private router: Router,
        private state: StateManagerService,
        private gift: GiftService,
        private fb: FormBuilder,
        private pmtService: PaymentService,
        private stripeService: StripeService,
    ) {
        this.state.setLoading(true);
        this.achForm = this.fb.group({
            accountName: ['', [<any>Validators.required]],
            routingNumber: ['', [<any>Validators.required, <any>Validators.minLength(9), <any>Validators.maxLength(9)]],
            accountNumber: ['', [<any>Validators.required, <any>Validators.minLength(4), <any>Validators.maxLength(30)]],
            accountType: ['', [<any>Validators.required]]
        });

        this.ccForm = this.fb.group({
            ccNumber: ['', [<any>Validators.required, <any>CreditCardValidator.validateCCNumber]],
            expDate: ['', [<any>Validators.required, <any>CreditCardValidator.validateExpDate]],
            cvv: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(4)]],
            zipCode: ['', [<any>Validators.required, <any>Validators.minLength(5), <any>Validators.maxLength(10)]]
        });

        this.ccForm.controls['expDate'].valueChanges.subscribe(
            value => this.gift.expDate = value
        );
    }

    ngOnInit() {

        if (this.gift.isFrequencySetAndNotOneTime()) {

            this.gift.resetExistingPmtInfo();
            this.gift.clearUserPmtInfo();
            this.state.setLoading(false);

        } else {

            if (this.gift.existingPaymentInfo) {
                this.gift.existingPaymentInfo.subscribe(
                    info => {
                        this.state.setLoading(false);
                        if (info !== null) {
                            this.gift.setBillingInfo(info);
                            if (this.gift.accountLast4) {
                                this.gift.donor = null;
                                this.state.hidePage(this.state.billingIndex);
                                this.adv();
                            }
                        }
                    },
                    error => this.state.setLoading(false)
                );
            } else {
                this.state.setLoading(false);
            }
        }

        this.gift.validateRoute(this.router);
    }

    public back() {
        this.gift.resetErrors();
        this.router.navigateByUrl(this.state.getPrevPageToShow(this.state.billingIndex));
        return false;
    }

    public achNext() {

        this.setACHSubmitted(true);
        this.gift.resetErrors();

        if (this.achForm.valid) {
            this.gift.paymentType = 'ach';
            this.gift.accountNumber = this.gift.accountNumber.trim();
            let email = this.gift.email;

            let userBank = new CustomerBank('US', 'USD', this.achForm.value.routingNumber,
                this.achForm.value.accountNumber,
                this.achForm.value.accountName,
                this.achForm.value.accountType);

            this.gift.userBank = userBank;

            let firstName = ''; // not used by API, except for guest donations
            let lastName = '';  // not used by API, except for guest donations

            this.state.setLoading(true);
            this.state.watchState();

            let donor;
            if (this.gift.isGuest === true) {
                donor = this.pmtService.getDonorByEmail(email);
            } else {
                donor = this.pmtService.getDonor();
            }
            donor.subscribe(
                donor => this.updateDonorWithBankAcct(donor.id, userBank, email),
                error => this.createDonorWithBank(userBank, email, firstName, lastName)
            );
        }
        return false;
    }

    private updateDonorWithBankAcct(donorId, userBank, email) {
        this.pmtService.updateDonorWithBankAcct(donorId, userBank, email).subscribe(
            value => this.setValueMoveNext(value),
            errorInner => this.handleDonorError(errorInner, false)
        );
    }

    private createDonorWithBank(userBank, email, firstName, lastName) {
      this.pmtService.createDonorWithBankAcct(userBank, email, firstName, lastName).subscribe(
          value => this.setValueMoveNext(value),
          errorInner => this.handleDonorError(errorInner, false)
      );
    }

    public ccNext() {

        this.setCCSubmitted(true);
        this.gift.resetErrors();

        if (this.ccForm.valid) {
            this.gift.paymentType = 'cc';

            let expMonth = this.ccForm.value.expDate.split(' / ')[0];
            let expYear = this.ccForm.value.expDate.split(' / ')[1];
            let email = this.gift.email;
            let userCard: CustomerCard = new CustomerCard(this.gift.email,
                this.ccForm.value.ccNumber,
                expMonth,
                expYear,
                this.ccForm.value.cvc,
                this.ccForm.value.zipCode);

            let firstName = '';
            let lastName = '';

            this.gift.userCc = userCard;
            this.state.setLoading(true);
            this.state.watchState();

            let donor;
            if (this.gift.isGuest === true) {
                donor = this.pmtService.getDonorByEmail(email);
            } else {
                donor = this.pmtService.getDonor();
            }
            donor.subscribe(
                donor => this.updateDonorWithCard(donor.id, userCard, email),
                error => this.createDonorWithCard(userCard, email, firstName, lastName)
            );
        }

        return false;
    }

    private updateDonorWithCard(donorId, userCard, email) {
        this.pmtService.updateDonorWithCard(donorId, userCard, email).subscribe(
            value => this.setValueMoveNext(value),
            errorInner => this.handleDonorError(errorInner, true)
        );
    }

    private createDonorWithCard(userCard, email, firstName, lastName) {
      this.pmtService.createDonorWithCard(userCard, email, firstName, lastName).subscribe(
          value => this.setValueMoveNext(value),
          errorInner => this.handleDonorError(errorInner, true)
      );
    }

    private adv() {
        this.router.navigateByUrl(this.state.getNextPageToShow(this.state.billingIndex));
        return false;
    }

    private handleDonorError(errResponse: any, isCC = false): boolean {
        if (isCC === true) {
            this.setCCSubmitted(false);
        } else {
            this.setACHSubmitted(false);
        }
        this.state.setLoading(false);
        if (errResponse.status === 400 || errResponse.status === 500) {
            this.gift.systemException = true;
            return false;
        } else {
            this.gift.stripeException = true;
            this.gift.resetExistingPmtInfo();
            this.gift.resetPaymentDetails();
            return false;
        }
    }

    private setValueMoveNext(value) {
        this.gift.donor = value;
        this.adv();
    }

    private setCCSubmitted(val: boolean) {
        this.ccSubmitted = val;
    }

    private setACHSubmitted(val: boolean) {
        this.achSubmitted = val;
    }

    public switchMessage(errors: any): string {
        let ret = `is <em>invalid</em>`;
        if (errors.required !== undefined) {
            ret = `is <u>required</u>`;
        }
        return ret;
    }

}
