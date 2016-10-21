import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
      name: 'I\'m In',
      frequencies: ['One Time', 'Weekly', 'Monthly']
    },
    {
      name: 'Crossroads General',
      frequencies: ['One Time', 'Weekly', 'Monthly']
    },
    {
      name: 'Reach Out',
      frequencies: ['One Time']
    }
  ];
  defaultFrequencies: Array<string> = ['One Time', 'Weekly', 'Monthly'];
  availableFrequencies: Array<string> = this.defaultFrequencies;
  form: FormGroup;
  startDate: any;

  constructor(@Inject(PrototypeStore) private store: any,
              private gift: PrototypeGiftService,
              private _fb: FormBuilder) {}

  ngOnInit() {
    this.setFrequencies();
    this.startDate = this.gift.start_date ? new Date(this.gift.start_date) : undefined;
    console.log(this.startDate);
    this.form = this._fb.group({
      fund: [this.gift.fund, [<any>Validators.required]],
      frequency: [this.gift.frequency, [<any>Validators.required]],
    });
  }

  back() {
    this.store.dispatch(PrototypeActions.render(this.gift.flow_type + '/amount'));
    return false;
  }

  next() {
    this.store.dispatch(PrototypeActions.render(this.gift.flow_type + '/auth'));
    return false;
  }

  resetDate() {
    this.startDate = undefined;
    this.gift.resetDate();
  }

  setFrequencies() {
    this.availableFrequencies = _.find(this.funds, (f) => {
      return (f.name === this.gift.fund);
    }).frequencies;

    if (this.availableFrequencies.indexOf(this.gift.frequency) === -1) {
      this.gift.frequency = _.first(this.availableFrequencies);
    }
  }

  onClickFund(fund) {
    this.gift.fund = fund.name;
    this.setFrequencies();
  }

  onClickFrequency(frequency) {
    this.gift.frequency = frequency;
    if (frequency === 'One Time') {
      this.resetDate();
    }
  }

  onClickDate(newValue) {
    this.gift.start_date = newValue;
  }

}
