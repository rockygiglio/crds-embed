import { Component, Inject } from '@angular/core';
import { PrototypeStore } from '../prototype-state/prototype.store';
import { PrototypeGiftService } from '../prototype-gift.service';

@Component({
  selector: 'app-prototype-confirmation',
  templateUrl: './prototype-confirmation.component.html',
  styleUrls: ['./prototype-confirmation.component.css']
})
export class PrototypeConfirmationComponent {

  constructor(@Inject(PrototypeStore) private store: any,
              private gift: PrototypeGiftService) { }

}
