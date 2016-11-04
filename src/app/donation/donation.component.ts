import { Component, OnInit } from '@angular/core';
import { GiftService } from '../services/gift.service';

@Component({
  selector: 'app-donation',
  templateUrl: 'donation.component.html',
  styleUrls: ['donation.component.css']
})
export class DonationComponent implements OnInit {

  constructor(public gift: GiftService) {}

  ngOnInit() {}

}
