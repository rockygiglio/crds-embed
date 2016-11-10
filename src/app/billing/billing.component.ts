import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { GiftService } from '../services/gift.service';
import { ExistingPaymentInfoService } from '../services/existing-payment-info.service';

import { GivingStore } from '../giving-state/giving.store';
import * as GivingActions from '../giving-state/giving.action-creators';

import { CreditCardValidator } from '../validators/credit-card.validator';

import { CustomerBank } from '../classes/customer-bank';
import { CustomerCard} from '../classes/customer-card';

import { StripeService } from '../services/stripe.service';

import { UserSessionService } from '../services/user-session.service';

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

  constructor( @Inject(GivingStore) private store: any,
    private gift: GiftService,
    private fb: FormBuilder,
    private paymentService: ExistingPaymentInfoService,
    private pmtService: PaymentService,
    private userSessionService: UserSessionService,
    private stripeService: StripeService) { }

  ngOnInit() {
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
    this.store.dispatch(GivingActions.render(this.gift.getPrevPageToShow(this.gift.billingIndex)));
    return false;
  }

  achNext() {
    console.log('next pressed');
    this.achSubmitted = true;
    if (this.achForm.valid) {

      console.log('ach form valid, executing');
      let email = this.userSessionService.getUserEmail();

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

      console.log('cc valid');

      let expMonth = 12;//this.ccForm.value.expDate(0,2);
      let expYear = 17;// this.ccForm.value.expDate(2, this.ccForm.value.expDate.length - 1);
      let email = this.userSessionService.getUserEmail();
      let userCard: CustomerCard = new CustomerCard('mpcrds+20@gmail.com'/*email*/, this.ccForm.value.ccNumber, expMonth, expYear, this.ccForm.value.cvc, this.ccForm.value.zipCode);
      //let userCard: CustomerCard = new CustomerCard('mpcrds+20@gmail.com', 4242424242424242, 12, 17, 123, 12345);
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
    this.store.dispatch(GivingActions.render(this.gift.getNextPageToShow(this.gift.billingIndex)));
  }

}
