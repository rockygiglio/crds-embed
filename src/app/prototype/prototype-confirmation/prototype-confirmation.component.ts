import { Component, Inject, OnInit } from '@angular/core';
import { PrototypeStore } from '../prototype-state/prototype.store';
import * as PrototypeActions from '../prototype-state/prototype.action-creators';
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
