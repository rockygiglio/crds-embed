import { Component } from '@angular/core';
import { GiftService } from '../services/gift.service';
import * as moment from 'moment';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent {

  constructor(private gift: GiftService) { }

  frequencyCalculation(): string {
    let startDate = moment(this.gift.start_date);
    if (this.gift.frequency === 'Monthly') {
      return 'the ' + startDate.format('Do') + ' of the Month';
    }
    return 'Every ' + startDate.format('dddd');
  }

}
