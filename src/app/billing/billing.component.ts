import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreditCardValidator } from '../validators/credit-card.validator';
import { CustomerBank } from '../models/customer-bank';
import { CustomerCard} from '../models/customer-card';
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
  ccSubmitted  = false;
  userToken = null;
  accountNumberPlaceholder = 'Account Number';

  errorMessage: string = 'The following fields are in error:';
  errorMessageACH: string = '';
  errorMessageCC: string = '';

  constructor( private router: Router,
    private stateManagerService: StateManagerService,
    private gift: GiftService,
    private fb: FormBuilder,
    private pmtService: PaymentService,
    private stripeService: StripeService) { }

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
    this.gift.stripeException = false;
    this.gift.systemException = false;
    this.router.navigateByUrl(this.stateManagerService.getPrevPageToShow(this.stateManagerService.billingIndex));
    return false;
  }

  switchMessage(errors: any): string {
    let ret = `is <em>invalid</em>`;
    if ( errors.required !==  undefined ) {
      ret = `is <u>required</u>`;
    }
    return ret;
  }

  achNext() {
    this.achSubmitted = true;
    this.gift.stripeException = false;
    this.gift.systemException = false;

    if (this.achForm.valid) {
      this.gift.paymentType = 'ach';
      this.gift.accountNumber = this.gift.accountNumber.trim();
      let email = this.gift.email;

      let userBank = new CustomerBank('US', 'USD', this.achForm.value.routingNumber, this.achForm.value.accountNumber,
                                       this.achForm.value.accountName, this.achForm.value.accountType);

      let firstName = ''; // not used by API, except for guest donations
      let lastName = '';  // not used by API, except for guest donations

      this.pmtService.getDonor().subscribe(
          donor => {
            this.pmtService.updateDonorWithBankAcct(donor.id, userBank, email).subscribe(
               value => {
                 this.adv();
              },
              errorInner => {
console.log('ACH - Error in errorInner UPDATE');
console.log(errorInner);
                if (errorInner.status === 400) {
                  this.gift.systemException = true;
                  return false;
                } else {
                  this.gift.stripeException = true;
                  this.gift.resetExistingPaymentInfo();
                  this.gift.resetPaymentDetails();
                  
                  this.router.navigateByUrl('/billing');
                  
                  return false;
                }
              }
            );
          },
          error => {
            this.pmtService.createDonorWithBankAcct(userBank, email, firstName, lastName).subscribe(
               value => {
                 this.adv();
              },
              errorInner => {
console.log('ACH - Error in errorInner CREATE');
console.log(errorInner);
                if (errorInner.status === 400) {
                  this.gift.systemException = true;
                  return false;
                } else {
                  this.gift.stripeException = true;
                  this.gift.resetExistingPaymentInfo();
                  this.gift.resetPaymentDetails();
                  // this.router.navigateByUrl('/billing');
                  return false;
                }
              }
            );
          }
      );
    }
    return false;
  }

  ccNext() {
    this.ccSubmitted = true;
    this.gift.stripeException = false;
    this.gift.systemException = false;
    if (this.ccForm.valid) {
      this.gift.paymentType = 'cc';

      let expMonth = this.ccForm.value.expDate.split(' / ')[0];
      let expYear = this.ccForm.value.expDate.split(' / ')[1];

      let email = this.gift.email;

      let userCard: CustomerCard = new CustomerCard(this.gift.email, this.ccForm.value.ccNumber, expMonth, expYear,
                                                    this.ccForm.value.cvc, this.ccForm.value.zipCode);

      let firstName = 'placeholder'; // not used by API, except for guest donations
      let lastName = 'placeholder';  // not used by API, except for guest donations

      this.pmtService.getDonor().subscribe(
          donor => {
            this.pmtService.updateDonorWithCard(donor.id, userCard, email).subscribe(
               value => {
                 this.adv();
              },
              errorInner => {


console.log('CC - Error in errorInner UPDATE');
console.log(errorInner);
                if (errorInner.status === 400) {
console.log('CC - 400');
                  this.gift.systemException = true;
                  this.router.navigateByUrl('/billing');
                  return false;
                } else {
console.log('CC - not 400');
                  this.gift.stripeException = true;
                  this.gift.resetExistingPaymentInfo();
                  this.gift.resetPaymentDetails();
                  this.router.navigateByUrl('/billing');
                  return false;
                }


              }
            );
          },
          error => {
            this.pmtService.createDonorWithCard(userCard, email, firstName, lastName).subscribe(
               value => {
                 this.adv();
              },
              errorInner => {
console.log('CC - Error in errorInner CREATE');
console.log(errorInner);
                if (errorInner.status === 400) {
                  this.gift.systemException = true;
                  this.router.navigateByUrl('/billing');
                  return false;
                } else {
                  this.gift.stripeException = true;
                  this.gift.resetExistingPaymentInfo();
                  this.gift.resetPaymentDetails();
                  this.router.navigateByUrl('/billing');
                  return false;
                }
              }
            );
          }
      );
    }
    return false;
  }

  adv() {
    this.router.navigateByUrl(this.stateManagerService.getNextPageToShow(this.stateManagerService.billingIndex));
  }

}
