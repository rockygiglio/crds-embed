import { Component, OnInit, animate, state, style, transition, trigger } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { GiftService } from '../services/gift.service';
import { PreviousGiftAmountService } from '../services/previous-gift-amount.service';
import { QuickDonationAmountsService } from '../services/quick-donation-amounts.service';
import { StateManagerService } from '../services/state-manager.service';

// NOTE, RE: US5801 – See previous previousGiftAmount implementation in
// SHA: f2f8b93ee6e5e0c2fed0f5d2f7dbf85b830c496a - Sarah Sachs, 11/30/2016

@Component({
  selector: 'app-payment',
  templateUrl: 'payment.component.html',
  styleUrls: ['payment.component.scss'],
  animations: [
    trigger('customAmountForm', [
      state('expanded', style({ height: '*' })),
      state('collapsed', style({ height: '0px' })),
      transition('collapsed => expanded', animate('200ms ease-in')),
      transition('expanded => collapsed', animate('200ms 200ms ease-out'))
    ])
  ]
})
export class PaymentComponent implements OnInit {
  public amountDue: Array<Object>;
  public customAmount: number;
  public form: FormGroup;
  public selectedAmount: number;
  public predefinedAmounts: number[];
  public submitted: boolean = false;
  public errorMessage: string = '';
  public customAmtSelected: boolean = false;

  constructor(private fb: FormBuilder,
              private gift: GiftService,
              private previousGiftAmountService: PreviousGiftAmountService,
              private quickDonationAmountsService: QuickDonationAmountsService,
              private router: Router,
              private state: StateManagerService) {
  }

  ngOnInit() {
    this.state.setLoading(true);
    if (this.gift.isDonation()) {
      if ( !this.gift.predefinedAmounts ) {
        this.getPredefinedDonationAmounts();
      } else {
        this.predefinedAmounts = this.gift.predefinedAmounts;
        this.state.setLoading(false);
      }
    } else {
      this.state.setLoading(false);
    }

    this.amountDue = [
      {
        label: 'Minimum Payment',
        amount: this.gift.minPayment
      },
      {
        label: 'Full Balance',
        amount: this.gift.totalCost
      }
    ];

    // set these for returning values
    this.selectedAmount = this.gift.selectedAmount;
    this.customAmount = this.gift.customAmount;

    this.form = this.fb.group({
      customAmount: ['', [<any>Validators.required, this.validateAmount.bind(this)]],
      selectedAmount: ['']
    });
  }

  getPredefinedDonationAmounts() {
    this.quickDonationAmountsService.getQuickDonationAmounts().subscribe(
      amounts => {
        this.predefinedAmounts = amounts;
        this.gift.predefinedAmounts = amounts;
        this.state.setLoading(false);
      },
      error => this.errorMessage = <any>error
    );
  }

  isValid() {
    return this.gift.validAmount();
  }

  next() {
    if ( this.isValid() ) {
      this.state.setLoading(true);
      this.router.navigateByUrl(this.state.getNextPageToShow(this.state.paymentIndex));
    } else {
      this.form.controls['customAmount'].markAsTouched();
      this.setErrorMessage();
    }
    this.submitted = true;
    return false;
  }

  setErrorMessage() {
    if (this.gift.amount === undefined || this.gift.amount === null) {
      this.errorMessage = 'Please select or provide an amount.';
    } else if ( isNaN(this.gift.amount) || !this.gift.validDollarAmount(this.gift.amount) ) {
      this.errorMessage = 'The amount you provided is not a valid number.';
    } else if (Number(this.gift.amount) > this.gift.totalCost) {
      this.errorMessage = 'The amount you provided is higher than the total cost.';
    } else if (Number(this.gift.amount) < this.gift.minPayment) {
      this.errorMessage = 'The amount you provided is less than the minimum payment allowed.';
    } else if (Number(this.gift.amount) > 999999.99) {
      this.errorMessage = 'You can not charge more than 1 million dollars.';
    }else {
      this.errorMessage = 'An unknown error has occurred.';
    }
  }

  onCustomAmount(value) {
    if ( value !== undefined ) {
      delete(this.selectedAmount);
      this.setAmount(value);
      this.setErrorMessage();
    }
    this.gift.customAmount = value;
  }

  onSelectAmount(value) {
    this.form.controls['customAmount'].markAsUntouched();
    this.submitted = false;
    this.customAmtSelected = false;
    delete(this.customAmount);
    this.gift.selectedAmount = value;
    this.setAmount(value);
  }

  setAmount(value) {
    this.gift.amount = value;
  }

  selectedCustom() {
    this.onSelectAmount(null);
    this.customAmtSelected = true;
  }

  private validateAmount(control) {
    if (this.gift.validAmount()) {
      return null;
    } else {
      return {
        validateAmount: false
      };
    }
  }

}
