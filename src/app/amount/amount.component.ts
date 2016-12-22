import { Angulartics2 } from 'angulartics2';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { APIService } from '../services/api.service';
import { StateService } from '../services/state.service';
import { StoreService } from '../services/store.service';
import { ValidationService } from '../services/validation.service';

// NOTE, RE: US5801 – See previous previousGiftAmount implementation in
// SHA: f2f8b93ee6e5e0c2fed0f5d2f7dbf85b830c496a - Sarah Sachs, 11/30/2016

@Component({
  selector: 'app-payment',
  templateUrl: 'amount.component.html'
})
export class AmountComponent implements OnInit {

  public amountDue: Array<Object>;
  public customAmount: string;
  public form: FormGroup;
  public selectedAmount: number;
  public predefinedAmounts: number[];
  public submitted: boolean = false;
  public errorMessage: string = '';
  public customAmtSelected: boolean = false;

  constructor(
    private api: APIService,
    private fb: FormBuilder,
    private router: Router,
    private state: StateService,
    private store: StoreService,
    private validation: ValidationService,
    private angulartics: Angulartics2
  ) {}

  public ngOnInit() {

    this.state.setLoading(true);
    if (this.store.isDonation()) {
      if (!this.store.predefinedAmounts) {
        this.getPredefinedDonationAmounts();
      } else {
        this.predefinedAmounts = this.store.predefinedAmounts;
        this.state.setLoading(false);
      }
    } else {
      this.state.setLoading(false);
    }

    this.amountDue = [
      {
        label: 'Minimum Payment',
        amount: this.store.minPayment
      },
      {
        label: 'Full Balance',
        amount: this.store.totalCost
      }
    ];

    if (this.store.isPayment() && this.store.totalCost && this.store.minPayment === this.store.totalCost) {
      this.setAmount(this.store.totalCost);
      this.state.hidePage(this.state.amountIndex);
      this.store.amountLocked = true;
      this.router.navigateByUrl(this.state.getNextPageToShow(this.state.amountIndex));
    } else {
      this.store.amountLocked = false;
    }

    this.selectedAmount = this.store.selectedAmount;

    if ( this.store.customAmount ) {
      this.customAmount = Number(this.store.customAmount).toFixed(2);
      this.customAmtSelected = true;
    }

    this.form = this.fb.group({
      customAmount: ['', [<any>Validators.required, this.validateAmount.bind(this)]],
      selectedAmount: ['']
    });

  }

  public getPredefinedDonationAmounts() {
    this.api.getQuickDonationAmounts().subscribe(
      amounts => {
        this.predefinedAmounts = amounts;
        this.store.predefinedAmounts = amounts;
        this.state.setLoading(false);
      }
    );
  }

  public submitAmount() {
    if (this.store.validAmount()) {
      this.state.setLoading(true);
      this.router.navigateByUrl(this.state.getNextPageToShow(this.state.amountIndex));

      if (!this.store.isPayment()) {
        this.angulartics.eventTrack.next({ action: 'Submitted', properties: { category: 'amountDonation', value: this.store.amount }});
      }

    } else {
      this.form.controls['customAmount'].markAsTouched();
      this.setErrorMessage();
    }
    this.submitted = true;
    return false;
  }

  public setErrorMessage() {
    if (this.store.amount === undefined || this.store.amount === null) {
      this.errorMessage = this.store.content.getContent('embedAmountProvide');
    } else if (isNaN(this.store.amount) || !this.validation.validDollarAmount(this.store.amount)) {
      this.errorMessage = this.store.content.getContent('invalidDonationAmount');
    } else if (Number(this.store.amount) < this.store.minimumStripeAmount) {
      this.errorMessage = this.store.content.getContent('embedAmountStripeMinimum').replace('{{ minimumStripeAmount }}', this.store.minimumStripeAmount.toFixed(2));
    } else if (this.store.isPayment() && Number(this.store.amount) > this.store.totalCost) {
      this.errorMessage = this.store.content.getContent('embedAmountTotalCost');
    } else if (this.store.isPayment() && Number(this.store.amount) < this.store.minPayment) {
      this.errorMessage = this.store.content.getContent('embedAmountMinimum');
    } else if (Number(this.store.amount) > 999999.99) {
      this.errorMessage = this.store.content.getContent('embedAmountStripeMaximum');
    } else {
      this.errorMessage = this.store.content.getContent('embedAmountUnknown');
    }
  }

  public onCustomAmount(value) {
    if (value !== undefined) {
      delete (this.selectedAmount);
      this.setAmount(value);
      this.setErrorMessage();
    }
    this.store.customAmount = Number(value);
  }

  public onSelectAmount(value) {
    this.form.controls['customAmount'].markAsUntouched();
    this.submitted = false;
    this.customAmtSelected = false;
    delete (this.customAmount);
    delete (this.store.customAmount);
    this.store.selectedAmount = value;
    this.setAmount(value);
  }

  public setAmount(value) {
    this.store.amount = Number(value);
  }

  public selectedCustom() {
    this.onSelectAmount(null);
    this.customAmtSelected = true;
  }

  private validateAmount(control) {
    if (this.store.validAmount()) {
      return null;
    } else {
      return {
        validateAmount: false
      };
    }
  }

}
