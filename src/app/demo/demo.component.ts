import { Component, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

declare var iFrameResize:any;

@Component({
  selector: 'demo',
  templateUrl: 'demo.component.html',
  styleUrls: ['demo.component.css']
})

export class DemoComponent {

  constructor() {

    /*
    require('iframe-resizer/js/iframeResizer.min.js');

    var iframes = iFrameResize({
        heightCalculationMethod: 'bodyScroll'
    }, '#hasResize');
    */
    
  }

}
