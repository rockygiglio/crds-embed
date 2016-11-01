import { Component, OnInit } from '@angular/core';
import { ParameterService } from "../services/parameter.service";

@Component({
  selector: 'app-donation',
  templateUrl: 'donation.component.html',
  styleUrls: ['donation.component.css']
})
export class DonationComponent implements OnInit {

  constructor(private params: ParameterService) {}

  ngOnInit() {}

}
