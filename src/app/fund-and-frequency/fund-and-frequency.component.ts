import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { DonationFundService } from '../services/donation-fund.service';
import { Frequency } from '../models/frequency';
import { StoreService } from '../services/store.service';
import { Fund } from '../models/fund';
import { StateService } from '../services/state.service';


@Component({
  selector: 'app-prototype-details',
  templateUrl: 'fund-and-frequency.component.html'
})
export class FundAndFrequencyComponent implements OnInit {

  public funds: Array<Fund>;
  public form: FormGroup;
  public minDate: Date = new Date();
  public maxDate: Date = new Date( new Date().setFullYear(new Date().getFullYear() + 1) );
  public startDate: any;
  public fundIdParam: number;
  public isFundSelectShown: boolean = undefined;
  public defaultFund: Fund;

  constructor(private fundService: DonationFundService,
              private store: StoreService,
              private route: ActivatedRoute,
              private router: Router,
              private state: StateService,
              private _fb: FormBuilder) {}

  public ngOnInit(): void {

    if ( this.funds === undefined || this.funds.length <= 0 ) {
      this.funds = this.route.snapshot.data['giveTo'];
      this.store.funds = this.funds;
    } else {
      this.funds = this.store.funds;
    }
    this.fundIdParam = this.store.fundId;
    this.defaultFund = this.fundService.getDefaultFund();
    if (!this.store.fund) {
      this.store.fund = this.fundService.getUrlParamFundOrDefault(this.fundIdParam, this.funds, this.defaultFund);
    }
    if (!this.store.frequency) {
      this.store.frequency  = this.store.frequencies[0];
    }
    this.isFundSelectShown = !this.funds.find(fund => Number(fund.ID) === Number(this.fundIdParam));
    this.store.start_date = this.store.start_date ? new Date(this.store.start_date) : new Date();
    this.form = this._fb.group({
      fund: [this.store.fund, [<any>Validators.required]],
      frequency: [this.store.frequency, [<any>Validators.required]],
    });

    this.store.validateRoute(this.router);
    this.state.setLoading(false);
  }

  public back() {
    this.router.navigateByUrl(this.state.getPrevPageToShow(this.state.fundIndex));
  }

  public submitFrequency() {
    if ( this.store.isFrequencySetAndNotOneTime() ) {
      this.store.resetExistingPmtInfo();
      this.store.clearUserPmtInfo();
      this.state.unhidePage(this.state.billingIndex);
    }
    this.router.navigateByUrl(this.state.getNextPageToShow(this.state.fundIndex));
  }

  public onClickFrequency(frequency: Frequency) {
    if (this.store.fund.AllowRecurringGiving) {
        this.store.frequency = frequency;
    }
  }

  public onClickFund(fund: any) {
    this.store.fund = fund;
    if (!fund.AllowRecurringGiving) {
        this.store.frequency = this.store.getFirstNonRecurringFrequency();
        this.store.start_date = new Date();
    }
  }

  public resetDate() {
    this.store.start_date = undefined;
  }
}
