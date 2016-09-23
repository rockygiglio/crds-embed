import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Store } from 'redux';
import { PrototypeStore } from './prototype-state/prototype.store';
import { PrototypeState } from './prototype-state/prototype.interfaces';
import * as PrototypeActions from './prototype-state/prototype.action-creators';
import { PrototypeGiftService } from './prototype-gift.service';

@Component({
  selector: 'app-prototype',
  templateUrl: 'prototype.component.html',
  styleUrls: ['prototype.component.css']
})
export class PrototypeComponent {
  action: string;
  
  constructor(@Inject(PrototypeStore) private store: any,
              private route: ActivatedRoute,
              private router: Router,
              private gift: PrototypeGiftService) {
    store.subscribe(() => this.readState());
  }

  readState() {
    let state: PrototypeState = this.store.getState() as PrototypeState;
    this.action = state.action;
    this.router.navigate([this.action], { relativeTo: this.route });
  }
 
}
