import { Component, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

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
