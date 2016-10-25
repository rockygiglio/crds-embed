import { Component } from '@angular/core';

@Component({
  selector: 'iframe-demo',
  templateUrl: 'iframe.component.html',
  styleUrls: ['../demo.component.css']
})

export class IframeComponent {

  iFrameResizerCW:any;

  /*-------------------------
  IMPORTANT: For all content 
  windows to work you will
  need to include this script
  or it won't be able to 
  report to the parent
  controller script. To keep
  from memory leaks I only
  assign this once.
  --------------------------*/
  constructor() {
    if ( this.iFrameResizerCW === undefined ) {
      this.iFrameResizerCW = require('iframe-resizer/js/iframeResizer.contentWindow.min.js');
    }
  }

}
