import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Store } from 'redux';
import { PrototypeStore } from './prototype.store';
import { PrototypeState } from './prototype.interfaces';
import * as PrototypeActions from './prototype.action-creators';

@Component({
  selector: 'app-prototype',
  templateUrl: 'prototype.component.html',
  styleUrls: ['prototype.component.css']
})
export class PrototypeComponent {
  action: string;
  
  constructor(@Inject(PrototypeStore) private store: any, private route: ActivatedRoute, private router: Router) {
    store.subscribe(() => this.readState());
    this.readState();
  }

  readState() {
    let state: PrototypeState = this.store.getState() as PrototypeState;
    this.action = state.action;
    this.router.navigate([this.action], { relativeTo: this.route });
  }
 
}
