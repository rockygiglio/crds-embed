import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreditCardValidator } from '../validators/credit-card.validator';
import { CustomerBank } from '../models/customer-bank';
import { CustomerCard } from '../models/customer-card';
import { StoreService } from '../services/store.service';
import { StripeService } from '../services/stripe.service';
import { PaymentService } from '../services/payment.service';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {

  public achForm: FormGroup;
  public ccForm: FormGroup;
  public hideCheck: boolean = true;
  public achSubmitted = false;
  public ccSubmitted = false;
  public userToken = null;
  public accountNumberPlaceholder = 'Account Number';

  public errorMessage: string = 'The following fields are in error:';
  public errorMessageACH: string = '';
  public errorMessageCC: string = '';

  constructor(private router: Router,
    private state: StateService,
    private store: StoreService,
    private fb: FormBuilder,
    private pmtService: PaymentService,
    private stripeService: StripeService) {

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
      value => this.store.expDate = value
    );
  }

  public ngOnInit() {

    if (this.store.isFrequencySetAndNotOneTime()) {

      this.store.resetExistingPmtInfo();
      this.store.clearUserPmtInfo();
      this.state.setLoading(false);

    } else {

      if (this.store.existingPaymentInfo) {
        this.store.existingPaymentInfo.subscribe(
          info => {
            this.state.setLoading(false);
            if (info !== null) {
              this.store.setBillingInfo(info);
              if (this.store.accountLast4) {
                this.store.donor = null;
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

    this.store.validateRoute(this.router);
  }

  public back() {
    this.store.resetErrors();
    this.router.navigateByUrl(this.state.getPrevPageToShow(this.state.billingIndex));
    return false;
  }

  public achSubmit() {

    this.setACHSubmitted(true);
    this.store.resetErrors();

    if (this.achForm.valid) {
      this.store.paymentType = 'ach';
      this.store.accountNumber = this.store.accountNumber.trim();
      let email = this.store.email;

      let userBank = new CustomerBank('US', 'USD', this.achForm.value.routingNumber,
        this.achForm.value.accountNumber,
        this.achForm.value.accountName,
        this.achForm.value.accountType);

      this.store.userBank = userBank;

      let firstName = ''; // not used by API, except for guest donations
      let lastName = '';  // not used by API, except for guest donations

      this.state.setLoading(true);
      this.state.watchState();
      this.pmtService.getDonor().subscribe(
        donor => {
          this.pmtService.updateDonorWithBankAcct(donor.id, userBank, email).subscribe(
            value => this.setValueMoveNext(value),
            errorInner => this.handleDonorError(errorInner, false)
          );
        },
        error => {
          this.pmtService.createDonorWithBankAcct(userBank, email, firstName, lastName).subscribe(
            value => this.setValueMoveNext(value),
            errorInner => this.handleDonorError(errorInner, false)
          );
        }
      );
    }
    return false;
  }

  public ccSubmit() {

    this.setCCSubmitted(true);
    this.store.resetErrors();

    if (this.ccForm.valid) {
      this.store.paymentType = 'cc';

      let expMonth = this.ccForm.value.expDate.split(' / ')[0];
      let expYear = this.ccForm.value.expDate.split(' / ')[1];
      let email = this.store.email;
      let userCard: CustomerCard = new CustomerCard(this.store.email,
        this.ccForm.value.ccNumber,
        expMonth,
        expYear,
        this.ccForm.value.cvc,
        this.ccForm.value.zipCode);

      let firstName = '';
      let lastName = '';

      this.store.userCc = userCard;
      this.state.setLoading(true);
      this.state.watchState();
      this.pmtService.getDonor().subscribe(
        donor => {
          this.pmtService.updateDonorWithCard(donor.id, userCard, email).subscribe(
            value => this.setValueMoveNext(value),
            errorInner => this.handleDonorError(errorInner, true)
          );
        },
        error => {
          this.pmtService.createDonorWithCard(userCard, email, firstName, lastName).subscribe(
            value => this.setValueMoveNext(value),
            errorInner => this.handleDonorError(errorInner, true)
          );
        }
      );
    }
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
      this.store.systemException = true;
      return false;
    } else {
      this.store.stripeException = true;
      this.store.resetExistingPmtInfo();
      this.store.resetPaymentDetails();
      return false;
    }
  }

  private setValueMoveNext(value) {
    this.store.donor = value;
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
