import { Component } from '@angular/core';

import { GiftService } from '../services/gift.service';
import { StateManagerService } from '../services/state-manager.service';
import * as moment from 'moment';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent {

  constructor(private gift: GiftService,
              private stateManagerService: StateManagerService) { }

  ngOnInit(): void {
    this.stateManagerService.is_loading = false;
  }

  frequencyCalculation(): string {
    let startDate = moment(this.gift.start_date);
    if (this.gift.frequency === 'Monthly') {
      return 'the ' + startDate.format('Do') + ' of the Month';
    }
    return 'Every ' + startDate.format('dddd');
  }

}
