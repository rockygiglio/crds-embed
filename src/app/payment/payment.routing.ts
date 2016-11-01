import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentComponent } from './payment.component';
import { LandingComponent } from './landing/landing.component';

const PaymentRoutes: Routes = [
  {
    path: 'payment',
    component: PaymentComponent,
  }
];

export const PaymentRouting: ModuleWithProviders = RouterModule.forChild(PaymentRoutes);
