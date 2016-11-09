import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Angulartics2 } from 'angulartics2';
import { Angulartics2GoogleTagManager } from 'angulartics2/dist/providers';

import { GivingStore } from './giving-state/giving.store';
import { GivingState } from './giving-state/giving.interfaces';

@Component({
  selector: 'app-root',
  template: '<div class="prototype-component container"><router-outlet></router-outlet></div>',
  styleUrls: ['../styles/application.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent {
  action: string;
  type: string;
  params: any;

  constructor( @Inject(GivingStore) private store: any,
    private route: ActivatedRoute,
    private router: Router,
    private angulartics2: Angulartics2,
    private angulartics2GoogleTagManager: Angulartics2GoogleTagManager) {

    this.store.subscribe(() => this.readState());
  }

  readState() {
    let state: GivingState = this.store.getState() as GivingState;
    this.action = state.action;
    this.router.navigate([this.action], { relativeTo: this.route });
  }

}
