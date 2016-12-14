import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Angulartics2GoogleTagManager } from 'angulartics2';

import { ContentService } from './content-service/services/content.service';
import { StateManagerService } from './services/state-manager.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="container" [ngClass]="{'loading': state.is_loading}">
      <preloader></preloader>
      <div class="outlet-wrapper">
        <router-outlet></router-outlet>
      </div>
    </div>`,
  styleUrls: ['../styles/application.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent implements OnInit {
  action: string;
  type: string;
  params: any;
  iFrameResizerCW: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contentService: ContentService,
    private angulartics2GoogleTagManager: Angulartics2GoogleTagManager,
    private state: StateManagerService) {

    if ( this.iFrameResizerCW === undefined ) {
      this.iFrameResizerCW = require('iframe-resizer/js/iframeResizer.contentWindow.js');
    }

    (<any>window).Stripe.setPublishableKey(process.env.CRDS_STRIPE_PUBKEY);
  }

  ngOnInit() {
    this.contentService.loadData();
  }

}
