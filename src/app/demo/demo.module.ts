import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemoComponent } from './demo.component';
import { DemoRouting } from './demo.routing';
import { ContentComponent } from './content/content.component';
import { IframeComponent } from './iframe/iframe.component';

@NgModule({
  imports: [
    DemoRouting
  ],
  declarations: [
    DemoComponent,
    ContentComponent,
    IframeComponent
  ]
})

export class DemoModule { }
