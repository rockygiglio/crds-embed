import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PrototypeStore } from '../prototype-state/prototype.store';
import * as PrototypeActions from '../prototype-state/prototype.action-creators';
import { PrototypeGiftService } from '../prototype-gift.service';
import { QuickDonationAmountsService } from '../../services/quick-donation-amounts.service.ts';

@Component({
  selector: 'app-prototype-amount',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './prototype-amount.component.html',
  styleUrls: ['./prototype-amount.component.css']
})
export class PrototypeAmountComponent implements OnInit {
  public predefinedAmounts: number[] = [5, 25, 100, 500, 1000];
  public selectedAmount: string;
  public customAmount: number;
  public form: FormGroup;

  constructor(@Inject(PrototypeStore) private store: any,
              private gift: PrototypeGiftService,
              private quickAmounts: QuickDonationAmountsService,
              private _fb: FormBuilder) {}

  ngOnInit() {
    if (this.predefinedAmounts.indexOf(this.gift.amount) === -1) {
      this.customAmount = this.gift.amount;
    }
    this.form = this._fb.group({
      amount: [this.gift.amount, [<any>Validators.required]],
      customAmount: [this.gift.amount, [<any>Validators.pattern('^0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*$')]],
      selectedAmount: [this.gift.amount]
    });
  }

  getQuickAmounts(){
    console.log('Get quick amounts called');
    let quickAmts =this.quickAmounts.getQuickDonationAmounts();
    console.log(quickAmts);
  }

  next() {
    this.gift.init = false;
    if (this.gift.amount) {
      this.store.dispatch(PrototypeActions.render('details'));
    }
    return false;
  }

  onCustomAmount(newValue) {
    if (!isNaN(newValue)) {
      delete(this.selectedAmount);
      this.setAmount(newValue);
    }
  }

  onSelectAmount(event, newValue) {
    delete(this.customAmount);
    this.setAmount(newValue);
  }

  setAmount(newValue) {
    (<FormControl>this.form.controls['amount']).setValue(newValue, { onlySelf: true });
    this.gift.amount = parseInt(newValue, 10);
  }

}
