import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { GiftService } from '../services/gift.service';
import { ExistingPaymentInfoService } from '../services/existing-payment-info.service';

import { GivingStore } from '../giving-state/giving.store';
import * as GivingActions from '../giving-state/giving.action-creators';

import { CreditCardValidator } from '../validators/credit-card.validator';

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
    private paymentService: ExistingPaymentInfoService) { }

  ngOnInit() {
    if (!this.gift.type) {
      // this.store.dispatch(GivingActions.render('/payment'));
    }

    this.achForm = this.fb.group({
      accountName: ['', [<any>Validators.required]],
      routingNumber: ['', [<any>Validators.required, <any>Validators.minLength(9)]],
      accountNumber: ['', [<any>Validators.required, <any>Validators.minLength(4)]],
      accountType:   ['personal', [<any>Validators.required]]
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
    this.achSubmitted = true;
    if (this.achForm.valid) {
      this.gift.paymentType = 'ach';
      this.adv();
    }
    return false;
  }

  ccNext() {
    this.ccSubmitted = true;
    if (this.ccForm.valid) {
      this.gift.paymentType = 'cc';
      this.adv();
    }
    return false;
  }

  adv() {
    this.store.dispatch(GivingActions.render(this.gift.getNextPageToShow(this.gift.billingIndex)));
  }

}
