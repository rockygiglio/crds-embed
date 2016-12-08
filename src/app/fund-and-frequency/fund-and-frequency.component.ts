import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { DonationFundService } from '../services/donation-fund.service';
import { Frequency } from '../models/frequency';
import { StoreService } from '../services/store.service';
import { Program } from '../models/program';
import { StateManagerService } from '../services/state-manager.service';


@Component({
  selector: 'app-prototype-details',
  templateUrl: 'fund-and-frequency.component.html'
})
export class FundAndFrequencyComponent implements OnInit {

  funds: Array<Program>;
  form: FormGroup;
  minDate: Date = new Date();
  maxDate: Date = new Date( new Date().setFullYear(new Date().getFullYear() + 1) );
  startDate: any;
  fundIdParam: number;
  isFundSelectShown: boolean = undefined;
  defaultFund: Program = {
    'ProgramId': 3,
    'Name': 'General Giving',
    'ProgramType': 1,
    'AllowRecurringGiving': true
  };

  constructor(private fundsHlpr: DonationFundService,
              private store: StoreService,
              private route: ActivatedRoute,
              private router: Router,
              private state: StateManagerService,
              private _fb: FormBuilder) {}

  ngOnInit(): void {

    this.funds = this.route.snapshot.data['giveTo'];
    this.fundIdParam = this.store.fundId;
    if (!this.store.fund) {
      this.store.fund = this.fundsHlpr.getUrlParamFundOrDefault(this.fundIdParam, this.funds, this.defaultFund);
    }
    if (!this.store.frequency) {
      this.store.frequency  = this.store.frequencies[0];
    }
    this.isFundSelectShown = !this.funds.find(fund => Number(fund.ProgramId) === Number(this.fundIdParam));
    this.store.start_date = this.store.start_date ? new Date(this.store.start_date) : new Date();
    this.form = this._fb.group({
      fund: [this.store.fund, [<any>Validators.required]],
      frequency: [this.store.frequency, [<any>Validators.required]],
    });

    this.store.validateRoute(this.router);
    this.state.setLoading(false);
  }

  back(): boolean {
    this.router.navigateByUrl(this.state.getPrevPageToShow(this.state.fundIndex));
    return false;
  }

  next(): boolean {
    if ( this.store.isFrequencySetAndNotOneTime() ) {
      this.store.resetExistingPmtInfo();
      this.store.clearUserPmtInfo();
      this.state.unhidePage(this.state.billingIndex);
    }

    this.router.navigateByUrl(this.state.getNextPageToShow(this.state.fundIndex));
    return false;
  }

  onClickChangeDate(): void {
    this.store.start_date = undefined;
  }

  onClickDate(newValue: any): void {
    this.store.start_date = newValue;
  }

  onClickFrequency(frequency: Frequency): void {
    if (this.store.fund.AllowRecurringGiving) {
        this.store.frequency = frequency;
    }
  }

  onClickFund(fund: any): void {
    this.store.fund = fund;
    if (!fund.AllowRecurringGiving) {
        this.store.frequency = this.store.getFirstNonRecurringFrequency();
        this.resetDate();
    }
  }

  resetDate(): void {
    this.store.start_date = new Date();
  }
}
