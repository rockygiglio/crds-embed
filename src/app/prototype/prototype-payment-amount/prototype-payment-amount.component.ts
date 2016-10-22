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

  constructor(@Inject(PrototypeStore) private store: any,
              private gift: PrototypeGiftService,
              private _fb: FormBuilder) {
    this.gift.flow_type = 'payment';
  }

  ngOnInit() {
    this.form = this._fb.group({
      customAmount: [this.gift.amount, [<any>Validators.required]]
    });
  }

  next() {
    this.store.dispatch(PrototypeActions.render(this.gift.flow_type + '/auth'));
    return false;
  }

  onCustomAmount(newValue) {
    if (!isNaN(newValue)) {
      // delete(this.selectedAmount);
      // this.setAmount(newValue);
      console.log('Fixed it!');
    }
  }

}
