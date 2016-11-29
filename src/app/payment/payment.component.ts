import { Component, OnInit, animate, state, style, transition, trigger } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { GiftService } from '../services/gift.service';
import { PreviousGiftAmountService } from '../services/previous-gift-amount.service';
import { QuickDonationAmountsService } from '../services/quick-donation-amounts.service';
import { StateManagerService } from '../services/state-manager.service';


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
  public previousAmount: string;
  public loadPreviousAmount: boolean = true;
  public submitted: boolean = false;
  public errorMessage: string = '';
  public customAmtSelected: boolean = false;

  constructor(private fb: FormBuilder,
              private gift: GiftService,
              private previousGiftAmountService: PreviousGiftAmountService,
              private quickDonationAmountsService: QuickDonationAmountsService,
              private router: Router,
              private stateManagerService: StateManagerService) {
  }

  ngOnInit() {
    this.stateManagerService.is_loading = true;
    if (this.gift.type === 'donation') {
      this.getPredefinedDonationAmounts();
      if ( !this.gift.previousGiftAmount ) {
        this.getPreviousGiftAmount();
      } else if ( Number(this.gift.previousGiftAmount) !== Number(this.gift.customAmount) ) {
        this.previousAmount = this.gift.previousGiftAmount;
      } else {
        this.loadPreviousAmount = false;
      }
    } else {
      this.stateManagerService.is_loading = false;
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

  getPreviousGiftAmount() {
    this.previousGiftAmountService.get().subscribe(
      (amount) => {
        this.previousAmount = amount;
        this.gift.previousGiftAmount = amount;
      },
      error => this.errorMessage = <any>error);
  }

  getPredefinedDonationAmounts() {
    this.quickDonationAmountsService.getQuickDonationAmounts().subscribe(
      amounts => {
        this.predefinedAmounts = amounts;
        this.stateManagerService.is_loading = false;
      },
      error => this.errorMessage = <any>error
    );
  }

  isValid() {
    return this.gift.validAmount();
  }

  applyPreviousAmount() {
    this.customAmount = Number(this.previousAmount);
    this.gift.amount = Number(this.previousAmount);
    this.next();
  }

  next() {
    if ( this.isValid() ) {
      this.stateManagerService.is_loading = true;
      this.router.navigateByUrl(this.stateManagerService.getNextPageToShow(this.stateManagerService.paymentIndex));
    } else {
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
