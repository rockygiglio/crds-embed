import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';

import { StateService } from '../services/state.service';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html'
})
export class ConfirmationComponent implements OnInit {

  constructor(
    private store: StoreService,
    private state: StateService,
    private router: Router) {
    this.store.validateRoute(router);
    this.state.setLoading(false);
  }

  public ngOnInit(): void {
    this.state.is_loading = false;
  }

  public frequencyCalculation(): string {
    let startDate = moment(this.store.startDate);
    if (this.store.frequency.value === 'month') {
      return startDate.format('Do') + ' of the month';
    }
    return startDate.format('dddd');
  }

}
