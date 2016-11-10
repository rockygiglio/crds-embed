import { Component, Inject, OnInit } from '@angular/core';
import { GiftService } from '../services/gift.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {

  constructor(private gift: GiftService) { }

  ngOnInit() {

  }

}
