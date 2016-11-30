import { Component, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
  selector: 'content-demo',
  templateUrl: 'content.component.html',
  styleUrls: ['../demo.component.css']
})

export class ContentComponent implements AfterViewInit, OnDestroy {

  // object storage
  iFrameResizer: any;
  iFrames: any;

  // turn on logging
  debug: boolean = false;

  // set the css selector used in markup on our resizeable iframes
  iframeSelector: string = '.hasResize';

  /*-------------------------
  Since our script isn't 
  ES6 or TS, require it,
  but only once on construct
  --------------------------*/
  constructor() {
    if ( this.iFrameResizer === undefined ) {
      this.iFrameResizer = require('iframe-resizer/js/iframeResizer.min.js');
    }
  }

  /*---------------------
  Only use iFrameResizer
  once iFrames have been
  rendered by the dom.
  Ergo; OnInit
  ----------------------*/
  ngAfterViewInit() {
    this.iFrames = this.iFrameResizer({
        heightCalculationMethod: 'bodyScroll',
        log: this.debug
    }, this.iframeSelector);
  }

  /*--------------------
  Make sure to close out
  iFrames on destroy of
  this component. Could
  cause memory leaks.
  ---------------------*/
  ngOnDestroy() {
    this.closeIframes();
  }

  closeIframes() {
    for (let i = 0; i < this.iFrames.length; i++) {
      if ( this.iFrames[i].iFrameResizer !== undefined ) {
        this.iFrames[i].iFrameResizer.close();
      }
    }
  }

}
