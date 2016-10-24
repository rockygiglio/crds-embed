import { Component, Inject } from '@angular/core';

@Component({
  selector: 'iframe-demo',
  templateUrl: 'iframe.component.html',
  styleUrls: ['../demo.component.css']
})

export class IframeComponent {

  constructor() {

    require('iframe-resizer/js/iframeResizer.contentWindow.min.js');

  }

}
