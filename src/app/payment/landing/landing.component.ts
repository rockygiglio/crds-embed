import { Component, OnInit } from '@angular/core';

import { ParameterService } from '../../services/parameter.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  constructor(private params: ParameterService) { }

  ngOnInit() {
  }

}
