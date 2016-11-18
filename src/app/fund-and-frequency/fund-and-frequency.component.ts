import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as _ from 'lodash';

import { FundsService } from '../services/funds/funds.service';
import { GiftService } from '../services/gift.service';
import { Program } from '../interfaces/program';
import { StateManagerService } from '../services/state-manager.service';


@Component({
  selector: 'app-prototype-details',
  templateUrl: 'fund-and-frequency.component.html',
  styleUrls: ['fund-and-frequency.component.css']
})
export class FundAndFrequencyComponent implements OnInit {

  funds: Array<Program>;
  defaultFrequencies: Array<string> = ['One Time', 'Weekly', 'Monthly'];
  availableFrequencies: Array<string> = this.defaultFrequencies;
  form: FormGroup;
  startDate: any;
  fundIdParam: number;
  isFundSelectionHidden: boolean = undefined;
  defaultFund: Program = {
    'ProgramId': 3,
    'Name': 'General Giving',
    'ProgramType': 1,
    'AllowRecurringGiving': true
  };

  constructor(private route: ActivatedRoute,
              private fundsHlpr: FundsService,
              private gift: GiftService,
              private router: Router,
              private stateManagerService: StateManagerService,
              private _fb: FormBuilder) {}

  ngOnInit() {

    this.funds = this.route.snapshot.data['giveTo'];
    this.fundIdParam = this.gift.fundId;
    this.gift.fund = this.fundsHlpr.getFundNameOrDefault(this.fundIdParam, this.funds, this.defaultFund);
    this.setFrequencies();
    this.startDate = this.gift.start_date ? new Date(this.gift.start_date) : undefined;
    this.form = this._fb.group({
      fund: [this.gift.fund, [<any>Validators.required]],
      frequency: [this.gift.frequency, [<any>Validators.required]],
    });

    this.stateManagerService.is_loading = false;

  }

  back() {
    this.router.navigateByUrl(this.stateManagerService.getPrevPageToShow(this.stateManagerService.fundIndex));
    return false;
  }

  next() {
    this.router.navigateByUrl(this.stateManagerService.getNextPageToShow(this.stateManagerService.fundIndex));
    return false;
  }

  resetDate() {
    this.startDate = undefined;
    // this.gift.resetDate();
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