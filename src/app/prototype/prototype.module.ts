import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrototypeComponent } from './prototype.component';
import { prototypeRouting } from './prototype.routing';

@NgModule({
  imports: [
    CommonModule,
    prototypeRouting
  ],
  declarations: [PrototypeComponent]
})
export class PrototypeModule { }
