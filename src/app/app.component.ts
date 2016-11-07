import { Angulartics2 } from 'angulartics2';
import { Angulartics2GoogleTagManager } from 'angulartics2/dist/providers';
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<div class="prototype-component inline-giving container"><router-outlet></router-outlet></div>',
  styleUrls: ['../styles/application.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  constructor(angulartics2: Angulartics2, angulartics2GoogleTagManager: Angulartics2GoogleTagManager) {}
}
