import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { PrototypeStore } from '../prototype-state/prototype.store';
import * as PrototypeActions from '../prototype-state/prototype.action-creators';

@Component({
  selector: 'app-prototype-amount',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './prototype-amount.component.html',
  styleUrls: ['./prototype-amount.component.css']
})
export class PrototypeAmountComponent {
  public predefinedAmount:string;

  constructor(@Inject(PrototypeStore) private store: any) {}

  next() {
    this.store.dispatch(PrototypeActions.render('details'));
    return false;
  }

}
