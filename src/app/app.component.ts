import { Component, Inject, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Angulartics2 } from 'angulartics2';
import { Angulartics2GoogleTagManager } from 'angulartics2/dist/providers';

import { GivingStore } from './giving-state/giving.store';
import { GivingState } from './giving-state/giving.interfaces';
import { GiftService } from './services/gift.service';

@Component({
  selector: 'app-root',
  template: '<div class="prototype-component container"><router-outlet></router-outlet></div>',
  styleUrls: ['../styles/application.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent implements OnInit {
  action: string;
  type: string;

  constructor(@Inject(GivingStore) private store: any,
              private route: ActivatedRoute,
              private router: Router,
              private angulartics2: Angulartics2,
              private angulartics2GoogleTagManager: Angulartics2GoogleTagManager,
              private giftService: GiftService) {

  }

  ngOnInit() {
    this.store.subscribe(() => this.readState());
    this.giftService.preloadData();
  }

  readState() {
    let state: GivingState = this.store.getState() as GivingState;
    this.action = state.action;
    this.router.navigate([this.action], { relativeTo: this.route });
  }

}
