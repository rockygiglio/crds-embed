import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { GiftService } from '../services/gift.service';
import { ExistingPaymentInfoService } from '../services/existing-payment-info.service';

import { GivingStore } from '../giving-state/giving.store';
import * as GivingActions from '../giving-state/giving.action-creators';

import { CustomValidators } from '../validators/custom-validators';

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
  userToken = null;
  accountNumberPlaceholder = 'Account Number';

  constructor(@Inject(GivingStore) private store: any,
              private gift: GiftService,
              private fb: FormBuilder,
              private paymentService: ExistingPaymentInfoService) {
    paymentService.getTestUser().subscribe((userInfo) => {
      paymentService.getExistingPaymentInfo(userInfo['userToken']).subscribe((paymentInfo) => {
        if (paymentInfo) {
          gift.email = paymentInfo['email'];
          if (typeof paymentInfo['default_source'] !== 'undefined') {
            gift.routingNumber = paymentInfo['default_source'].bank_account.routing;
            gift.accountName   = paymentInfo['default_source'].bank_account.accountHolderName;
            gift.accountType   = paymentInfo['default_source'].bank_account.accountHolderType === 'individual' ?
              'personal' : 'business';

            this.accountNumberPlaceholder = `XXXXXXXXX${paymentInfo['default_source'].bank_account.last4}`;
          }
        }
      });
    });
  }

  ngOnInit() {
    if (!this.gift.type) {
      // this.store.dispatch(GivingActions.render('/payment'));
    }
    if (this.gift.paymentType) {
      this.gift.resetPaymentDetails();
    }

    this.achForm = this.fb.group({
      accountName: ['', [<any>Validators.required]],
      routingNumber: ['', [<any>Validators.required, <any>Validators.minLength(9)]],
      accountNumber: ['', [<any>Validators.required, <any>Validators.minLength(4)]],
      accountType:   ['personal', [<any>Validators.required]]
    });

    this.ccForm = this.fb.group({
      ccNumber: ['', [<any>Validators.required, <any>CustomValidators.creditCard]],
      expDate:  ['', [<any>Validators.required, <any>CustomValidators.expirationDate]],
      cvv:      ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(4)]],
      zipCode:  ['', [<any>Validators.required, <any>Validators.minLength(5)]]
    });

  }

  back() {
    this.store.dispatch(GivingActions.render('/payment'));
    return false;
  }

  achNext() {
    this.achSubmitted = true;
    if (this.achForm.valid) {
      this.gift.paymentType = 'ach';
      console.log(this.gift);
      // this.store.dispatch(GivingActions.render('summary'));
    }
    return false;
  }

  ccNext() {
    if (this.ccForm.valid) {
      this.gift.paymentType = 'cc';
      console.log(this.gift);
      // this.store.dispatch(GivingActions.render('summary'));
    }
    return false;
  }

}
