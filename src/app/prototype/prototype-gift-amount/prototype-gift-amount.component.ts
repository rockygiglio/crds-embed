import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PrototypeStore } from '../prototype-state/prototype.store';
import * as PrototypeActions from '../prototype-state/prototype.action-creators';
import { PrototypeGiftService } from '../prototype-gift.service';
import { QuickDonationAmountsService } from '../../services/quick-donation-amounts.service';
import { PreviousGiftAmountService } from '../../services/previous-gift-amount.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-prototype-amount',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './prototype-gift-amount.component.html',
  styleUrls: ['./prototype-gift-amount.component.css']
})

export class PrototypeGiftAmountComponent implements OnInit {
  public predefinedAmounts: number[] = this.route.snapshot.data['quickDonationAmounts'];
  public previousAmount: number = this.route.snapshot.data['previousGiftAmount'];
  public selectedAmount: string;
  public customAmount: number;
  public form: FormGroup;
  public isDataLoaded: boolean = false;
  public previous: number = 20;

  constructor(@Inject(PrototypeStore) private store: any,
              private route: ActivatedRoute,
              private gift: PrototypeGiftService,
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

  next() {
    this.gift.init = false;
    if (this.gift.amount) {
      this.store.dispatch(PrototypeActions.render(this.gift.flow_type + '/details'));
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
