import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemoComponent } from './demo.component';
import { DemoRouting } from './demo.routing';
import { IframeComponent } from './iframe.component';

@NgModule({
  imports: [
    DemoRouting
  ],
  declarations: [
    DemoComponent,
    IframeComponent
  ],
  providers: [
  ]
})

export class DemoModule { }
