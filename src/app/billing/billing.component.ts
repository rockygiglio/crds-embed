import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { GiftService } from '../services/gift.service';
import { ExistingPaymentInfoService } from '../services/existing-payment-info.service';
import { StateManagerService } from '../services/state-manager.service';
import { Router } from '@angular/router';

import { CreditCardValidator } from '../validators/credit-card.validator';

import { CustomerBank } from '../classes/customer-bank';
import { CustomerCard} from '../classes/customer-card';

import { StripeService } from '../services/stripe.service';

import { PaymentService } from '../services/payment.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
  public paymentMethod: string = 'Bank Account';
  achForm: FormGroup;
  ccForm: FormGroup;
  hideCheck: boolean = true;
  achSubmitted = false;
  ccSubmitted  = false;
  userToken = null;
  accountNumberPlaceholder = 'Account Number';

  constructor( private router: Router,
    private stateManagerService: StateManagerService,
    private gift: GiftService,
    private fb: FormBuilder,
    private paymentService: ExistingPaymentInfoService,
    private pmtService: PaymentService,
    private stripeService: StripeService) { }

  ngOnInit() {
    this.stateManagerService.is_loading = true;

    this.gift.existingPaymentInfo.subscribe(
      info => {
        this.stateManagerService.is_loading = false;
        this.gift.setBillingInfo(info);
        if (this.gift.accountLast4) {
          this.stateManagerService.hidePage(this.stateManagerService.billingIndex);
          this.adv();
        }
      },
      error => {
        this.stateManagerService.is_loading = false;
      }
    );

    if (!this.gift.type) {
      // this.store.dispatch(GivingActions.render('/payment'));
    }

    this.achForm = this.fb.group({
      accountName: ['', [<any>Validators.required]],
      routingNumber: ['', [<any>Validators.required, <any>Validators.minLength(9)]],
      accountNumber: ['', [<any>Validators.required, <any>Validators.minLength(4)]],
      accountType:   ['individual', [<any>Validators.required]]
    });

    this.ccForm = this.fb.group({
      ccNumber: ['', [<any>CreditCardValidator.validateCCNumber]],
      expDate:  ['', [<any>CreditCardValidator.validateExpDate]],
      cvc:      ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(4)]],
      zipCode:  ['', [<any>Validators.required, <any>Validators.minLength(5)]]
    });

    if ( this.gift.accountLast4) {
      // this user has a previous payment method 
      this.adv();
    } else {
      this.gift.resetPaymentDetails();
    }
  }

  back() {
    this.router.navigateByUrl(this.stateManagerService.getPrevPageToShow(this.stateManagerService.billingIndex));
    return false;
  }

  achNext() {
    console.log('next pressed');
    this.achSubmitted = true;
    if (this.achForm.valid) {

      console.log('ach form valid, executing');
      let email = this.gift.email;

      let userBank = new CustomerBank('US', 'USD', this.achForm.value.routingNumber, this.achForm.value.accountNumber,
                                       this.achForm.value.accountName, this.achForm.value.accountType);

      console.log('User bank');
      console.log(JSON.stringify(userBank));

      let firstName = 'placeholder'; //not used by API, except for guest donations
      let lastName = 'placeholder';  //not used by API, except for guest donations

      this.pmtService.createDonorWithBankAcct(userBank, email, firstName, lastName).subscribe(
          value => {
            console.log('GOT OBSERVABLE BANK RESULT: ');
            console.log(value);
            this.gift.paymentType = 'ach';
            this.adv();
          },
          error => {
            console.log('Failed to get stripe token');
          }
      );

    }
    return false;
  }

  ccNext() {
    this.ccSubmitted = true;

    if (this.ccForm.valid) {

      let expMonth = this.ccForm.value.expDate.split(' / ')[0];
      let expYear = this.ccForm.value.expDate.split(' / ')[1];

      let email = this.gift.email;

      //TODO Add actual user email as customer card param below
      let userCard: CustomerCard = new CustomerCard('mpcrds+20@gmail.com'/*email*/, this.ccForm.value.ccNumber, expMonth, expYear, this.ccForm.value.cvc, this.ccForm.value.zipCode);
      console.log(userCard);

      let firstName = 'placeholder'; //not used by API, except for guest donations
      let lastName = 'placeholder';  //not used by API, except for guest donations

      this.pmtService.createDonorWithCard(userCard, email, firstName, lastName).subscribe(
          value => {
            console.log('GOT OBSERVABLE CARD RESULT: ');
            console.log(value);
            this.gift.paymentType = 'cc';
            this.adv();
          },
          error => {
            console.log('Failed to get stripe token');
          }
      );

    }
    return false;
  }

  adv() {
    this.router.navigateByUrl(this.stateManagerService.getNextPageToShow(this.stateManagerService.billingIndex));
  }


}
