import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
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
  public selectedAmount: string;
  public amountDue: Array<Object>;

  constructor(private router: Router,
              private stateManagerService: StateManagerService,
              private gift: GiftService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    if (this.gift.type === 'donation') {
      this.router.navigateByUrl('/donation');
    }

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

    this.form = this.fb.group({
      amount: [this.gift.amount, [<any>Validators.required, this.validateAmount.bind(this)]],
      customAmount: [this.gift.amount, [<any>Validators.required, this.validateAmount.bind(this)]],
      selectedAmount: [this.gift.amount]
    });
  }

  next() {
    this.router.navigateByUrl(this.stateManagerService.getNextPageToShow(this.stateManagerService.paymentIndex));
    return false;
  }

  onCustomAmount(value) {
    if (!isNaN(value)) {
      delete(this.selectedAmount);
      this.setAmount(value);
    }
  }

  onSelectAmount(event, value) {
    delete(this.customAmount);
    this.setAmount(value);
  }

  setAmount(value) {
    (<FormControl>this.form.controls['amount']).setValue(value, { onlySelf: true });
    this.gift.amount = parseFloat(value);
  }

  isValid() {
    return this.form.valid || this.gift.validAmount();
  }

  private validateAmount(control) {
    return this.gift.validAmount() ? null : {
      validateAmount: true
    };
  }

}
