import { Component, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PrototypeStore } from './prototype-state/prototype.store';
import { PrototypeState } from './prototype-state/prototype.interfaces';

@Component({
  selector: 'app-prototype',
  templateUrl: 'prototype.component.html',
  styleUrls: ['prototype.component.css']
})
export class PrototypeComponent {
  action: string;

  constructor(@Inject(PrototypeStore) private store: any,
              private route: ActivatedRoute,
              private router: Router) {
    store.subscribe(() => this.readState());
  }

  readState() {
    let state: PrototypeState = this.store.getState() as PrototypeState;
    this.action = state.action;
    this.router.navigate([this.action], { relativeTo: this.route });
  }

}
