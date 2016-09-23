import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { PrototypeStore } from '../prototype-state/prototype.store';
import * as PrototypeActions from '../prototype-state/prototype.action-creators';
import { PrototypeGiftService } from '../prototype-gift.service';

@Component({
  selector: 'app-prototype-amount',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './prototype-amount.component.html',
  styleUrls: ['./prototype-amount.component.css']
})
export class PrototypeAmountComponent implements OnInit {
  public predefinedAmounts: number[] = [5, 25, 100, 500, 1000];  
  public selectedAmount: string;
  public customAmount: number;

  constructor(@Inject(PrototypeStore) private store: any,
              private gift: PrototypeGiftService) {}

  next() {
    this.store.dispatch(PrototypeActions.render('details'));
    return false;
  }

  onCustomAmount(newValue) {
    delete(this.selectedAmount);
    this.gift.amount = newValue; 
  }

  onSelectAmount(newValue) {
    delete(this.customAmount);
    this.gift.amount = parseInt(newValue); 
  }

  ngOnInit() {
    if(this.gift.amount) {
      if(this.predefinedAmounts.indexOf(this.gift.amount)> -1) {
        this.selectedAmount = this.gift.amount.toString();
      } else {
        this.customAmount = this.gift.amount;
      }
    }
  }
}
