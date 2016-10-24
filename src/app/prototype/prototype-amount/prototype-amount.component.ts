import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PrototypeStore } from '../prototype-state/prototype.store';
import * as PrototypeActions from '../prototype-state/prototype.action-creators';
import { PrototypeGiftService } from '../prototype-gift.service';
import { QuickDonationAmountsService } from '../../services/quick-donation-amounts.service.ts';
import { ActivatedRoute } from '@angular/router';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

@Component({
  selector: 'app-prototype-amount',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './prototype-amount.component.html',
  styleUrls: ['./prototype-amount.component.css']
})

export class PrototypeAmountComponent implements OnInit {
  quickDonationAmounts;
  public predefinedAmounts: number[] = this.route.snapshot.data['quickDonationAmounts'];//[5,4,3,2,1];
  public selectedAmount: string;
  public customAmount: number;
  public form: FormGroup;
  public isDataLoaded: boolean = false;

  constructor(@Inject(PrototypeStore) private store: any,
              private route: ActivatedRoute,
              private gift: PrototypeGiftService,
              private quickAmounts: QuickDonationAmountsService,
              private _fb: FormBuilder) {}

  ngOnInit() {
    console.log(this.route);

    this.getQuickAmounts();

    this.quickDonationAmounts = this.route.snapshot.data['quickDonationAmounts'];

    console.log('Snapshot amts');
    console.log(this.quickDonationAmounts);

    if (this.predefinedAmounts.indexOf(this.gift.amount) === -1) {
      this.customAmount = this.gift.amount;
    }

    this.form = this._fb.group({
      amount: [this.gift.amount, [<any>Validators.required]],
      customAmount: [this.gift.amount, [<any>Validators.pattern('^0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*$')]],
      selectedAmount: [this.gift.amount]
    });
  }

  getQuickAmounts() {
    this.quickAmounts.getQuickDonationAmounts()
        .subscribe(
            httpResp => {
              this.predefinedAmounts = httpResp;
              console.log('Logging from resp');
              console.log(httpResp);

              this.toggleDataLoaded();

              console.log('Is data loaded? ' + this.isDataLoaded);

            },
            error =>  this.predefinedAmounts = <any>error); //should be this.errorMsg
  }

  toggleDataLoaded(){
    this.isDataLoaded = !this.isDataLoaded;
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
