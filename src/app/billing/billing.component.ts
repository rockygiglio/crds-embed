import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { CreditCardValidator } from '../validators/credit-card.validator';
import { CustomerBank } from '../models/customer-bank';
import { CustomerCard } from '../models/customer-card';
import { StoreService } from '../services/store.service';
import { PaymentService } from '../services/payment.service';
import { StateService } from '../services/state.service';
import { Donor } from '../models/donor';
import { RecurringDonor } from '../models/recurring-donor';

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
    private paymentService: PaymentService) {
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
      this.state.setLoading(true);
      this.store.paymentType = 'ach';
      this.store.accountNumber = this.store.accountNumber.trim();
      let userBank = new CustomerBank(
        'US',
        'USD',
        this.achForm.value.routingNumber,
        this.achForm.value.accountNumber,
        this.achForm.value.accountName,
        this.achForm.value.accountType
      );
      this.store.userBank = userBank;
      this.getDonor(this.store.email).subscribe(
        donor => this.process(
          donor,
          userBank,
          this.paymentService.stripeMethods.ach,
          this.paymentService.restVerbs.put
        ),
        noDonor => this.process(
          noDonor,
          userBank,
          this.paymentService.stripeMethods.ach,
          this.paymentService.restVerbs.post
        )
      );
    }
  }

  public ccSubmit() {
    this.setCCSubmitted(true);
    this.store.resetErrors();
    if (this.ccForm.valid) {
      this.state.setLoading(true);
      this.store.paymentType = 'cc';
      let expMonth = this.ccForm.value.expDate.split(' / ')[0];
      let expYear = this.ccForm.value.expDate.split(' / ')[1];
      let userCard: CustomerCard = new CustomerCard(this.store.email,
        this.ccForm.value.ccNumber,
        expMonth,
        expYear,
        this.ccForm.value.cvc,
        this.ccForm.value.zipCode
      );
      this.store.userCc = userCard;
      this.getDonor(this.store.email).subscribe(
        donor => this.process(
          donor,
          userCard,
          this.paymentService.stripeMethods.card,
          this.paymentService.restVerbs.put
        ),
        noDonor => this.process(
          noDonor,
          userCard,
          this.paymentService.stripeMethods.card,
          this.paymentService.restVerbs.post
        )
      );
    }
  }

  private getDonor(email: string): Observable<any> {
    let donor: Observable<any>;
    if (this.store.isGuest === true) {
      donor = this.paymentService.getDonorByEmail(email);
    } else {
      donor = this.paymentService.getDonor();
    }
    return donor;
  }

  public process(donor: any, callBody: CustomerBank | CustomerCard, stripeMethod: string, restMethod: string) {
    this.paymentService.createStripeToken(stripeMethod, callBody).subscribe(
      token => this.storeToken(donor, token, stripeMethod, restMethod),
      error => this.handleError(error, stripeMethod)
    );
  }

  private storeToken(donor: any, value: any, stripeMethod: string, restMethod: string) {
    if (this.store.isRecurringGift()) {
      let recurrenceDate: string = this.store.start_date.toISOString().slice(0, 10);
      this.store.recurringDonor = new RecurringDonor(
        value.id,
        this.store.amount,
        this.store.fund.ID.toString(),
        this.store.frequency.value,
        recurrenceDate
      );
    } else if (this.store.isOneTimeGift()) {
      this.store.donor = new Donor(
        value.id,
        this.store.email,
        restMethod
      );
      this.store.donor.donor_id = donor.id;
    } else {
      this.handleError({ status: 500}, stripeMethod);
    }
    this.adv();
  }

  private handleError(errResponse: any, stripeMethod: string): boolean {
    let stripeMethods = this.paymentService.stripeMethods;
    if (stripeMethod === stripeMethods.card) {
      this.setCCSubmitted(false);
    } else if (stripeMethod === stripeMethods.ach) {
      this.setACHSubmitted(false);
    }
    if (errResponse.status === 400 || errResponse.status === 500) {
      this.store.systemException = true;
    } else {
      this.store.stripeException = true;
      this.store.resetExistingPmtInfo();
      this.store.resetPaymentDetails();
    }
    this.state.setLoading(false);
    return false;
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
