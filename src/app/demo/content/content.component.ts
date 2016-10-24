import { Component, OnInit } from '@angular/core';

declare var iFrameResize:any;

@Component({
  selector: 'content-demo',
  templateUrl: 'content.component.html',
  styleUrls: ['../demo.component.css']
})

export class ContentComponent {

  iFrameResize:any;
  iFrames:any;

  constructor() {
    this.iFrameResize = require('iframe-resizer/js/iframeResizer.min.js');
  }

  ngOnInit() {
    
    this.iFrames = this.iFrameResize({
        heightCalculationMethod: 'bodyScroll'
    }, '.hasResize');

  }

}
