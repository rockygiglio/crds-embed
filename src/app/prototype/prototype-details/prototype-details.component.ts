import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { PrototypeStore } from '../prototype-state/prototype.store';
import * as PrototypeActions from '../prototype-state/prototype.action-creators';
import { PrototypeGiftService } from '../prototype-gift.service';

declare var _;

@Component({
  selector: 'app-prototype-details',
  templateUrl: './prototype-details.component.html',
  styleUrls: ['./prototype-details.component.css']
})
export class PrototypeDetailsComponent implements OnInit {
  funds: { name: string, frequencies: Array<string> }[] = [
    {
      name: "I'm In",
      frequencies: ['One Time', 'Weekly', 'Monthly']
    },
    {
      name: "Crossroads General",
      frequencies: ['One Time', 'Weekly', 'Monthly']
    },
    {
      name: "Reach Out",
      frequencies: ['One Time']
    }
  ];
  defaultFrequencies: Array<string> = ['One Time', 'Weekly', 'Monthly'];
  availableFrequencies: Array<string> = this.defaultFrequencies;

  fund: string;
  frequency: string;
  form: FormGroup;

  constructor(@Inject(PrototypeStore) private store: any,
              private gift: PrototypeGiftService,
              private _fb: FormBuilder) {}

  ngOnInit() {
    this.setFund(_.first(this.funds));
    this.form = this._fb.group({
      fund: [this.gift.fund, [<any>Validators.required]],
      frequency: [this.gift.frequency, [<any>Validators.required]]
    });
  }

  back() {
    this.store.dispatch(PrototypeActions.render('amount'));
    return false;
  }

  next() {
    this.store.dispatch(PrototypeActions.render('auth'));
    return false;
  }

  setFund(fund) {
    this.gift.fund = fund.name;
    this.availableFrequencies = _.find(this.funds, (f) => { return (f.name == fund.name) }).frequencies;
    this.gift.frequency = _.first(this.availableFrequencies);
  }

}
