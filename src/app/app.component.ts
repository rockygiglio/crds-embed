import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<div class="prototype-component inline-giving container"><router-outlet></router-outlet></div>',
  styleUrls: ['../styles/application.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
}
