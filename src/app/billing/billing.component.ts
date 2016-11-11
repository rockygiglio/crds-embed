import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { GiftService } from '../services/gift.service';
import { ExistingPaymentInfoService } from '../services/existing-payment-info.service';
import { StateManagerService } from '../services/state-manager.service';
import { Router } from '@angular/router';

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

  constructor( private router: Router,
    private stateManagerService: StateManagerService,
    private gift: GiftService,
    private fb: FormBuilder,
    private paymentService: ExistingPaymentInfoService) { }

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
      accountType:   ['personal', [<any>Validators.required]]
    });

    this.ccForm = this.fb.group({
      ccNumber: ['', [<any>CreditCardValidator.validateCCNumber]],
      expDate:  ['', [<any>CreditCardValidator.validateExpDate]],
      cvv:      ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(4)]],
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
    this.router.navigateByUrl(this.stateManagerService.getNextPageToShow(this.stateManagerService.billingIndex));
  }

}
