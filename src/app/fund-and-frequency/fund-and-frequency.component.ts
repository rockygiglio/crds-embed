import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { DonationFundService } from '../services/donation-fund.service';
import { GiftFrequency } from '../models/gift-frequency';
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
  defaultFrequencies: Array<GiftFrequency> = new GiftFrequency('', '').getDefaultFrequencies();
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
              private gift: GiftService,
              private route: ActivatedRoute,
              private router: Router,
              private state: StateManagerService,
              private _fb: FormBuilder) {}

  ngOnInit(): void {

    this.funds = this.route.snapshot.data['giveTo'];
    this.fundIdParam = this.gift.fundId;
    if (!this.gift.fund) {
      this.gift.fund = this.fundsHlpr.getUrlParamFundOrDefault(this.fundIdParam, this.funds, this.defaultFund);
    }
    if (!this.gift.frequency) {
      this.gift.frequency  = 'One Time';
    }
    this.isFundSelectShown = !this.funds.find(fund => Number(fund.ProgramId) === Number(this.fundIdParam));
    this.gift.start_date = this.gift.start_date ? new Date(this.gift.start_date) : new Date();
    this.form = this._fb.group({
      fund: [this.gift.fund, [<any>Validators.required]],
      frequency: [this.gift.frequency, [<any>Validators.required]],
    });

    this.gift.validateRoute(this.router);
    this.state.setLoading(false);
  }

  back(): boolean {
    this.router.navigateByUrl(this.state.getPrevPageToShow(this.state.fundIndex));
    return false;
  }

  next(): boolean {
    if ( this.gift.isFrequencySetAndNotOneTime() ) {
      this.gift.resetExistingPmtInfo();
      this.gift.clearUserPmtInfo();
      this.state.unhidePage(this.state.billingIndex);
    }

    this.router.navigateByUrl(this.state.getNextPageToShow(this.state.fundIndex));
    return false;
  }

  onClickChangeDate(): void {
    this.gift.start_date = undefined;
  }

  onClickDate(newValue: any): void {
    this.gift.start_date = newValue;
  }

  onClickFrequency(frequency: any): void {
    if (this.gift.fund.AllowRecurringGiving) {
        this.gift.frequency = frequency;
    }
  }

  onClickFund(fund: any): void {
    this.gift.fund = fund;
    if (!fund.AllowRecurringGiving) {
        this.gift.frequency = 'One Time';
        this.resetDate();
    }
  }

  resetDate(): void {
    this.gift.start_date = new Date();
  }
}
