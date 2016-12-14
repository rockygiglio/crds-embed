import { Component, OnInit } from '@angular/core';

import { GiftService } from '../services/gift.service';
import { StateManagerService } from '../services/state-manager.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  constructor(private gift: GiftService,
    private state: StateManagerService,
    private router: Router) {
    this.gift.validateRoute(router);
    this.state.setLoading(false);
  }

  ngOnInit(): void {
    this.state.is_loading = false;
  }

  frequencyCalculation(): string {
    let startDate = moment(this.gift.start_date);

    if (this.gift.frequency === 'month') {
      return startDate.format('Do') + ' of the month';
    }

    return startDate.format('dddd');
  }

}
