import { Component, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Angulartics2GoogleTagManager, Angulartics2Segment } from 'angulartics2';

import { StateService } from './services/state.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="container" [ngClass]="{'loading': state.is_loading}">
      <app-preloader></app-preloader>
      <div class="outlet-wrapper">
        <router-outlet></router-outlet>
      </div>
    </div>`,
  styleUrls: ['../styles/application.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent {
  action: string;
  type: string;
  params: any;
  iFrameResizerCW: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private angulartics2GoogleTagManager: Angulartics2GoogleTagManager,
    private angulartics2Segment: Angulartics2Segment,
    private state: StateService) {

    if ( this.iFrameResizerCW === undefined ) {
      this.iFrameResizerCW = require('iframe-resizer/js/iframeResizer.contentWindow.js');
    }

    (<any>window).Stripe.setPublishableKey(process.env.CRDS_STRIPE_PUBKEY);
  }

}
