import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ParameterService } from "../services/parameter.service";

@Component({
  selector: 'app-payment',
  templateUrl: 'payment.component.html',
  styleUrls: ['payment.component.css']
})
export class PaymentComponent implements OnInit {

  constructor(public params: ParameterService,
              private location: Location) {
  }

  ngOnInit() {
    if (this.params.type === 'donation') {
      this.location.go('/donation')
    }
  }

}
