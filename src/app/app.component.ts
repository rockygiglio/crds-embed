import { Angulartics2 } from 'angulartics2';
import { Angulartics2GoogleTagManager } from 'angulartics2/dist/providers';
import { Component, ViewEncapsulation } from '@angular/core';
import { GiftService } from './services/gift.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="prototype-component container" [ngClass]="{'loading': gift.loading}">
      <preloader></preloader>
      <div class="outlet-wrapper">
        <router-outlet></router-outlet>
      </div>
    </div>`,
  styleUrls: ['../styles/application.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  constructor(angulartics2: Angulartics2,
              angulartics2GoogleTagManager: Angulartics2GoogleTagManager,
              private gift: GiftService) {}
}
