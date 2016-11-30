import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { PrototypeStore } from '../prototype-state/prototype.store';
import * as PrototypeActions from '../prototype-state/prototype.action-creators';
import { PrototypeGiftService } from '../prototype-gift.service';

import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

interface Program {
  Name: string;
  ProgramId: number;
  ProgramType: number;
  AllowRecurringGiving: boolean;
}

@Component({
  selector: 'app-prototype-details',
  templateUrl: './prototype-details.component.html',
  styleUrls: ['./prototype-details.component.css']
})
export class PrototypeDetailsComponent implements OnInit {

  funds: Array<Program>;
  defaultFrequencies: Array<string> = ['One Time', 'Weekly', 'Monthly'];
  availableFrequencies: Array<string> = this.defaultFrequencies;
  form: FormGroup;
  startDate: any;
  defaultFund: Program = {
    'ProgramId': 3,
    'Name': 'General Giving',
    'ProgramType': 1,
    'AllowRecurringGiving': true
  };

  constructor(@Inject(PrototypeStore) private store: any,
              private route: ActivatedRoute,
              private gift: PrototypeGiftService,
              private _fb: FormBuilder) {}

  ngOnInit() {
    this.gift.loading = false;
    this.funds = this.route.snapshot.data['giveTo'];
    this.gift.fund = this.defaultFund.Name;
    this.setFrequencies();
    this.startDate = this.gift.start_date ? new Date(this.gift.start_date) : undefined;
    this.form = this._fb.group({
      fund: [this.gift.fund, [<any>Validators.required]],
      frequency: [this.gift.frequency, [<any>Validators.required]],
    });
  }

  back() {
    this.gift.loading = true;
    setTimeout(() => {
      this.store.dispatch(PrototypeActions.render(this.gift.flow_type + '/amount'));
    }, 500);
    return false;
  }

  next() {
    this.gift.loading = true;
    setTimeout(() => {
      this.store.dispatch(PrototypeActions.render(this.gift.flow_type + '/auth'));
    }, 500);
    return false;
  }

  resetDate() {
    this.startDate = undefined;
    this.gift.resetDate();
  }

  setFrequencies() {
    let selectedFund = _.find(this.funds, (f: any) => {
      return (f.Name === this.gift.fund);
    });

    if (selectedFund.AllowRecurringGiving) {
      this.availableFrequencies = this.defaultFrequencies;
    } else {
      this.gift.frequency = _.first(this.availableFrequencies);
      this.availableFrequencies.push(_.first(this.availableFrequencies));
    }
  }

  onClickFund(fund: any) {
    this.gift.fund = fund.Name;
    this.setFrequencies();
  }

  onClickFrequency(frequency: any) {
    this.gift.frequency = frequency;
    if (frequency === 'One Time') {
      this.resetDate();
    }
  }

  onClickDate(newValue: any) {
    this.gift.start_date = newValue;
  }

}
