import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Store } from 'redux';
import { PrototypeStore } from './prototype.store';
import { PrototypeState } from './prototype.state';
import * as PrototypeActions from './prototype.action-creators';

@Component({
  selector: 'app-prototype',
  templateUrl: 'prototype.component.html',
  styleUrls: ['prototype.component.css']
})
export class PrototypeComponent implements OnInit {
  counter: number;
  
  constructor(@Inject(PrototypeStore) private store: any, private route: ActivatedRoute, private router: Router) {
    store.subscribe(() => this.readState());
    this.readState();

    // let initialState: AppState = { messages: [] }; 
    // let reducer: Reducer<AppState> = (state: AppState = initialState, action: Action) => {};
    // let store: Store<AppState> = createStore<AppState>(reducer);

    // console.log(store.getState());
  }

  readState() {
    let state: PrototypeState = this.store.getState() as PrototypeState;
    this.counter = state.counter;
  }
 
  increment() {
    this.store.dispatch(PrototypeActions.increment());
  }
 
  decrement() {
    this.store.dispatch(PrototypeActions.decrement());
  }

  ngOnInit() {
    console.log('init');
  }

  goBack(event: Event) {
    console.log(this.route.params);
    this.router.navigate([''], { relativeTo: this.route });
    return false;    
  }

  goNext(event: Event) {
    this.router.navigate(['details'], { relativeTo: this.route });
    return false;
  }

}
