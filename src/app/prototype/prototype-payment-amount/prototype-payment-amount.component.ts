import { ChangeDetectionStrategy, Inject, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PrototypeStore } from '../prototype-state/prototype.store';
import * as PrototypeActions from '../prototype-state/prototype.action-creators';
import { PrototypeGiftService } from '../prototype-gift.service';

@Component({
  selector: 'app-prototype-payment-amount',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './prototype-payment-amount.component.html',
  styleUrls: ['./prototype-payment-amount.component.scss']
})

export class PrototypePaymentAmountComponent implements OnInit {
  public form: FormGroup;
  public customAmount: number;
  public selectedAmount: string;

  amount_due = [
    {
      label: 'Min Due',
      amount: 100.00
    },
    {
      label: 'Total Due',
      amount: 400.00
    }
  ];

  constructor(@Inject(PrototypeStore) private store: any,
              private gift: PrototypeGiftService,
              private _fb: FormBuilder) {
    this.gift.flow_type = 'payment';
  }

  ngOnInit() {

    /*
    if (_.pluck(this.amount_due, 'amount').indexOf(this.gift.amount) === -1) {
      this.customAmount = this.gift.amount;
    }
    */

    this.form = this._fb.group({
      amount: [this.gift.amount, [<any>Validators.required]],
      customAmount: [this.gift.amount, [<any>Validators.required]],
      selectedAmount: [this.gift.amount]
    });
  }

  next() {
    this.store.dispatch(PrototypeActions.render(this.gift.flow_type + '/auth'));
    return false;
  }

  onCustomAmount(newValue: any) {
    if (!isNaN(newValue)) {
      delete(this.selectedAmount);
      this.setAmount(newValue);
    }
  }

  onSelectAmount(event: any, newValue: any) {
    delete(this.customAmount);
    this.setAmount(newValue);
  }

  setAmount(newValue: any) {
    (<FormControl>this.form.controls['amount']).setValue(newValue, { onlySelf: true });
    this.gift.amount = parseInt(newValue, 10);
  }

}
