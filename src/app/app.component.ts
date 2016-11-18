import { Component, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Angulartics2 } from 'angulartics2';
import { Angulartics2GoogleTagManager } from 'angulartics2/dist/providers';

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

export class AppComponent {
  action: string;
  type: string;
  params: any;
  iFrameResizerCW: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private angulartics2: Angulartics2,
    private angulartics2GoogleTagManager: Angulartics2GoogleTagManager,
    private state: StateManagerService) {

    if ( this.iFrameResizerCW === undefined ) {
      this.iFrameResizerCW = require('iframe-resizer/js/iframeResizer.contentWindow.js');
    }

  }

}
