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
  achForm: FormGroup;
  ccForm: FormGroup;
  hideCheck: boolean = true;
  achSubmitted = false;
  ccSubmitted  = false;
  userToken = null;
  accountNumberPlaceholder = 'Account Number';

  errorMessage: string = 'Please fix the following errors:';
  errorMessageACH: string = '';
  errorMessageCC: string = '';

  constructor( private router: Router,
    private stateManagerService: StateManagerService,
    private gift: GiftService,
    private fb: FormBuilder,
    private paymentService: ExistingPaymentInfoService) { }

  ngOnInit() {
    this.stateManagerService.is_loading = true;

    if ( this.gift.existingPaymentInfo ) {
        this.gift.existingPaymentInfo.subscribe(
        info => {
          this.stateManagerService.is_loading = false;
          if ( info !== null ) {
            this.gift.setBillingInfo(info);
            if (this.gift.accountLast4) {
              this.stateManagerService.hidePage(this.stateManagerService.billingIndex);
              this.adv();
            }
          }
        },
        error => {
          this.stateManagerService.is_loading = false;
        }
      );
    } else {
      this.stateManagerService.is_loading = false;
    }

    this.achForm = this.fb.group({
      accountName: ['', [<any>Validators.required]],
      routingNumber: ['', [<any>Validators.required, <any>Validators.minLength(9), <any>Validators.maxLength(9)]],
      accountNumber: ['', [<any>Validators.required, <any>Validators.minLength(4), <any>Validators.maxLength(30)]],
      accountType:   ['', [<any>Validators.required]]
    });

    this.ccForm = this.fb.group({
      ccNumber: ['', [<any>Validators.required, <any>CreditCardValidator.validateCCNumber]],
      expDate:  ['', [<any>Validators.required, <any>CreditCardValidator.validateExpDate]],
      cvv:      ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(4)]],
      zipCode:  ['', [<any>Validators.required, <any>Validators.minLength(5), <any>Validators.maxLength(10)]]
    });

    if ( this.gift.accountLast4) {
      this.adv();
    }

    if (!this.gift.type) {
      this.router.navigateByUrl('/payment');
    }

  }

  back() {
    this.router.navigateByUrl(this.stateManagerService.getPrevPageToShow(this.stateManagerService.billingIndex));
    return false;
  }

  switchMessage(errors: any): string {
    let ret = ' is <em>invalid</em>';
    if ( errors.required !==  undefined ) {
      ret = ' is <u>required</u>';
    }
    return ret;
  }

  displayErrorsACH() {
    if ( !this.achForm.valid ) {
      console.log(this.achForm);
      let thisMessage = '<p>' + this.errorMessage + '</p>';
      thisMessage += '<ul>';
      if ( !this.achForm.controls['accountName'].valid ) {

        thisMessage += '<li>Account name ' + this.switchMessage(this.achForm.controls['accountName'].errors) + '</li>';
      }
      if ( !this.achForm.controls['accountNumber'].valid ) {
        thisMessage += '<li>Account number ' + this.switchMessage(this.achForm.controls['accountNumber'].errors) + '</li>';
      }
      if ( !this.achForm.controls['routingNumber'].valid ) {
        thisMessage += '<li>Routing number ' + this.switchMessage(this.achForm.controls['routingNumber'].errors) + '</li>';
      }
      thisMessage += '</ul>';
      this.errorMessageACH = thisMessage;
    } else {
      this.errorMessageACH = '';
    }
  }

  displayErrorsCC() {
    if ( !this.ccForm.valid ) {
      let thisMessage = '<p>' + this.errorMessage + '</p>';
      thisMessage += '<ul>';
      if ( !this.ccForm.controls['ccNumber'].valid ) {
        thisMessage += '<li>Card number ' + this.switchMessage(this.ccForm.controls['ccNumber'].errors) + '</li>';
      }
      if ( !this.ccForm.controls['expDate'].valid ) {
        thisMessage += '<li>Expiration date ' + this.switchMessage(this.ccForm.controls['expDate'].errors) + '</li>';
      }
      if ( !this.ccForm.controls['cvv'].valid ) {
        thisMessage += '<li>CVV ' + this.switchMessage(this.ccForm.controls['cvv'].errors) + '</li>';
      }
      if ( !this.ccForm.controls['zipCode'].valid ) {
        thisMessage += '<li>Zip code ' + this.switchMessage(this.ccForm.controls['zipCode'].errors) + '</li>';
      }
      thisMessage += '</ul>';
      this.errorMessageCC = thisMessage;
    } else {
      this.errorMessageCC = '';
    }
  }

  achNext() {
    this.achSubmitted = true;
    this.gift.accountNumber = this.gift.accountNumber.toString().trim();
    if (this.achForm.valid) {
      this.gift.paymentType = 'ach';
      this.adv();
    } else {
      this.displayErrorsACH();
    }
    return false;
  }

  ccNext() {
    this.ccSubmitted = true;
    if (this.ccForm.valid) {
      this.gift.paymentType = 'cc';
      this.adv();
    } else {
      this.displayErrorsCC();
    }
    return false;
  }

  adv() {
    this.router.navigateByUrl(this.stateManagerService.getNextPageToShow(this.stateManagerService.billingIndex));
  }

}
