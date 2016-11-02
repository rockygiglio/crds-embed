import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, JsonpModule  } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertModule, ButtonsModule, CollapseModule, DatepickerModule, TabsModule } from 'ng2-bootstrap/ng2-bootstrap';

import { PaymentComponent } from './payment.component';
import { PaymentRouting } from './payment.routing';

import { LandingComponent } from './landing/landing.component';

import { ParameterService } from '../services/parameter.service';

@NgModule({
  imports: [
    AlertModule,
    ButtonsModule,
    CollapseModule,
    CommonModule,
    HttpModule,
    DatepickerModule,
    PaymentRouting,
    ReactiveFormsModule,
    TabsModule,
    JsonpModule
  ],
  declarations: [
    PaymentComponent,
    LandingComponent
  ],
  providers: [
    ParameterService
  ]
})
export class PaymentModule { }
