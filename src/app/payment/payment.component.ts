import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StateManagerService } from '../services/state-manager.service';
import { GiftService } from '../services/gift.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'payment.component.html',
  styleUrls: ['payment.component.css']
})
export class PaymentComponent implements OnInit {
  public form: FormGroup;
  public customAmount: number;
  public selectedAmount: number;
  public amountDue: Array<Object>;
  public submitted: boolean = false;
  public errorMessage: string = '';

  constructor(private router: Router,
              private stateManagerService: StateManagerService,
              private gift: GiftService,
              private fb: FormBuilder) {

  }

  ngOnInit() {
    (<any>window).Stripe.setPublishableKey(process.env.CRDS_STRIPE_PUBKEY);

    if (this.gift.type === 'donation') {
      this.router.navigateByUrl('/donation');
    }

    this.stateManagerService.is_loading = false;

    this.amountDue = [
      {
        label: 'Minimum Due',
        amount: this.gift.minPayment
      },
      {
        label: 'Total Due',
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

  next() {
    this.submitted = true;
    if ( this.isValid() ) {
      this.router.navigateByUrl(this.stateManagerService.getNextPageToShow(this.stateManagerService.paymentIndex));
    } else {
      this.setErrorMessage();
    }
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

  onSelectAmount(event, value) {
    this.submitted = false;
    delete(this.customAmount);
    this.gift.selectedAmount = value;
    this.setAmount(value);
  }

  setAmount(value) {
    this.gift.amount = value;
  }

  isValid() {
    return this.gift.validAmount();
  }

  private validateAmount(control) {
    return this.gift.validAmount() ? null : {
      validateAmount: true
    };
  }

}
