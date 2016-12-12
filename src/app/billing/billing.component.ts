import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
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
    private state: StateService,
    private store: StoreService,
    private fb: FormBuilder,
    private paymentService: PaymentService,
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

  public achSubmit() {

    this.setACHSubmitted(true);
    this.store.resetErrors();

    if (this.achForm.valid) {
      this.store.paymentType = 'ach';
      this.store.accountNumber = this.store.accountNumber.trim();
      let email = this.store.email;

      let userBank = new CustomerBank(
        'US',
        'USD',
        this.achForm.value.routingNumber,
        this.achForm.value.accountNumber,
        this.achForm.value.accountName,
        this.achForm.value.accountType
      );

      this.store.userBank = userBank;

      let firstName = '';
      let lastName = '';

      this.state.setLoading(true);
      this.state.watchState();

      this.getDonorCallback(email).subscribe(
        donor => this.updateDonorWithBankAcct(donor.id, userBank, email),
        error => this.createDonorWithBank(userBank, email, firstName, lastName)
      );
    }
    return false;
  }

  private updateDonorWithBankAcct(donorId, userBank, email) {
    this.paymentService.updateDonorWithBankAcct(donorId, userBank, email).subscribe(
      value => this.setValueMoveNext(value),
      errorInner => this.handleDonorError(errorInner, false)
    );
  }

  private createDonorWithBank(userBank, email, firstName, lastName) {
    this.paymentService.createDonorWithBankAcct(userBank, email, firstName, lastName).subscribe(
      value => this.setValueMoveNext(value),
      errorInner => this.handleDonorError(errorInner, false)
    );
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

      this.getDonorCallback(email).subscribe(
        donor => this.updateDonorWithCard(donor.id, userCard, email),
        error => this.createDonorWithCard(userCard, email, firstName, lastName)
      );
    }

    return false;
  }

  private updateDonorWithCard(donorId, userCard, email) {
    this.paymentService.updateDonorWithCard(donorId, userCard, email).subscribe(
      value => this.setValueMoveNext(value),
      errorInner => this.handleDonorError(errorInner, true)
    );
  }

  private createDonorWithCard(userCard, email, firstName, lastName) {
    this.paymentService.createDonorWithCard(userCard, email, firstName, lastName).subscribe(
      value => this.setValueMoveNext(value),
      errorInner => this.handleDonorError(errorInner, true)
    );
  }

  private getDonorCallback(email): Observable<any> {
    let donor: Observable<any>;
    if (this.store.isGuest === true) {
      donor = this.paymentService.getDonorByEmail(email);
    } else {
      donor = this.paymentService.getDonor();
    }
    return donor;
  }

  public back() {
    this.store.resetErrors();
    this.router.navigateByUrl(this.state.getPrevPageToShow(this.state.billingIndex));
    return false;
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
