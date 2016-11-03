import { ChangeDetectionStrategy, Inject, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { GiftService } from "../services/gift.service";
import { GivingStore } from "../giving-state/giving.store";

@Component({
  selector: 'app-payment',
  templateUrl: 'payment.component.html',
  styleUrls: ['payment.component.css']
})
export class PaymentComponent implements OnInit {
  public form: FormGroup;
  public customAmount: number;
  public selectedAmount: string;
  public amountDue: Array<Object>;

  constructor(@Inject(GivingStore) private store: any,
              private location: Location,
              private gift: GiftService,
              private fb: FormBuilder) {
  }


  ngOnInit() {
    if (this.gift.type === 'donation') {
      this.location.go('/donation')
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
    // this.store.dispatch(this.PrototypeActions.render('/auth'));
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
    this.gift.amount = parseInt(value, 10);
  }

  isValid() {
    return this.form.valid || this.gift.validAmount();
  }

  private validateAmount(control) {
    return this.gift.validAmount() ? null : {
      validateAmount: true
    }
  }

}
