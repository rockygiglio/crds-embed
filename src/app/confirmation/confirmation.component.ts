import { Component, OnInit } from '@angular/core';

import { StoreService } from '../services/store.service';
import { StateService } from '../services/state.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

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

  ngOnInit(): void {
    this.state.is_loading = false;
  }

  frequencyCalculation(): string {
    let startDate = moment(this.store.start_date);

    if (this.store.frequency.value === 'month') {
      return 'the ' + startDate.format('Do') + ' of the Month';
    }

    return 'Every ' + startDate.format('dddd');
  }

}
