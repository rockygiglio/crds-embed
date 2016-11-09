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

  constructor( @Inject(GivingStore) private store: any,
    private gift: GiftService,
    private fb: FormBuilder,
    private paymentService: ExistingPaymentInfoService) { }

  ngOnInit() {
    if (!this.gift.type) {
      this.store.dispatch(GivingActions.render('/payment'));
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

    if (this.gift.paymentType === 'ach') {
      this.achNext();
    } else if (this.gift.paymentType === 'cc') {
      this.ccNext();
    } else {
      this.gift.resetPaymentDetails();
    }
  }

  back() {
    this.store.dispatch(GivingActions.render('/payment'));
    return false;
  }

  achNext() {
    this.achSubmitted = true;
    this.achForm.controls['accountName'].setValue(this.gift.accountName);
    this.achForm.controls['routingNumber'].setValue(this.gift.routingNumber);
    this.achForm.controls['accountNumber'].setValue(this.gift.accountNumber);
    this.achForm.controls['accountType'].setValue(this.gift.accountType);
    if (this.achForm.valid) {
      this.gift.paymentType = 'ach';
      // console.log(this.gift);
      this.store.dispatch(GivingActions.render('summary'));
    }
    return false;
  }

  ccNext() {
    Object.keys(this.ccForm.controls).forEach(key => {
      this.achForm.controls[key].updateValueAndValidity();
    });
    if (this.ccForm.valid) {
      this.gift.paymentType = 'cc';
      console.log(this.gift);
      this.store.dispatch(GivingActions.render('summary'));
    }
    return false;
  }

}
