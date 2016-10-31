import { Component, OnInit } from '@angular/core';
import {ParameterService} from "../services/parameter.service";

@Component({
  selector: 'app-payment',
  templateUrl: 'payment.component.html',
  styleUrls: ['payment.component.css']
})
export class PaymentComponent implements OnInit {

  constructor(private paramsService: ParameterService) {}

  ngOnInit() {}

}
