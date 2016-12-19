import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { APIService } from '../services/api.service';
import { StoreService } from '../services/store.service';
import { StateService } from '../services/state.service';

import { Frequency } from '../models/frequency';
import { Fund } from '../models/fund';


@Component({
  selector: 'app-fund-and-frequency',
  templateUrl: 'fund-and-frequency.component.html'
})
export class FundAndFrequencyComponent implements OnInit {

  public funds: Array<Fund>;
  public form: FormGroup;
  public selectedDate: Date = new Date();
  public minDate: Date = new Date();
  public maxDate: Date = new Date( new Date().setFullYear(new Date().getFullYear() + 1) );
  public startDate: Date;

  public fundIdParam: number;
  public isFundSelectShown: boolean = undefined;
  public defaultFund: Fund;
  public showDatePicker: boolean = false;

  constructor(
    private api: APIService,
    private store: StoreService,
    private route: ActivatedRoute,
    private router: Router,
    private state: StateService,
    private fb: FormBuilder) {
    this.fundIdParam = this.store.fundId;
    this.defaultFund = this.store.fund = this.api.defaults.fund;
    this.form = this.fb.group({
      fund: [this.store.fund, [<any>Validators.required]],
      frequency: [this.store.frequency, [<any>Validators.required]],
    });
  }

  public ngOnInit(): void {
    if ( this.funds === undefined || this.funds.length <= 0 ) {
      this.state.setLoading(true);
      this.api.getFunds().subscribe(
        (funds) => {
          this.funds = funds;
          this.store.funds = this.funds;
          this.load();
        }
      );
    } else {
      this.funds = this.store.funds;
      this.load();
    }
    this.selectedDate = this.store.startDate;
  }

  public load() {
    if (this.fundIdParam) {
      for (let i = 0; i < this.funds.length; i++) {
        if (Number(this.funds[i].ID === Number(this.fundIdParam))) {
          this.store.fund = this.funds[i];
          break;
        }
      }
    }
    if (!this.store.frequency) {
      this.store.frequency  = this.store.frequencies[0];
    }
    this.isFundSelectShown = !this.funds.find(fund => Number(fund.ID) === Number(this.fundIdParam));
    if (this.isFundSelectShown === false && this.store.fund.AllowRecurringGiving === false) {
      this.state.hidePage(this.state.fundIndex);
      this.router.navigateByUrl(this.state.getNextPageToShow(this.state.fundIndex));
    } else {
      this.store.validateRoute(this.router);
      this.state.setLoading(false);
    }
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
        this.store.loadDate();
    }
  }

  public toggleDatePicker(val: boolean) {
    this.showDatePicker = val;
  }

  public updateStartDate(value) {
    if ( value.getTime() !== this.store.startDate.getTime() ) {
      this.store.startDate = value;
      this.toggleDatePicker(false);
    }
  }

}
