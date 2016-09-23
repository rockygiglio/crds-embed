import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrototypeComponent } from './prototype.component';
import { PrototypeAmountComponent } from './prototype-amount/prototype-amount.component';
import { PrototypeDetailsComponent } from './prototype-details/prototype-details.component';
import { PrototypeAuthenticationComponent } from './prototype-authentication/prototype-authentication.component';
import { PrototypeSummaryComponent } from './prototype-summary/prototype-summary.component';
import { PrototypePaymentComponent } from './prototype-payment/prototype-payment.component';
import { PrototypeConfirmationComponent } from './prototype-confirmation/prototype-confirmation.component';
import { PrototypeRegistrationComponent } from './prototype-registration/prototype-registration.component';
import { PrototypePasswordComponent } from './prototype-password/prototype-password.component';

const prototypeRoutes: Routes = [
  {
    path: 'prototype',
    component: PrototypeComponent,
    children: [
      { path: 'amount', component: PrototypeAmountComponent },
      { path: 'details', component: PrototypeDetailsComponent },
      { path: 'auth', component: PrototypeAuthenticationComponent },
      { path: 'payment', component: PrototypePaymentComponent },
      { path: 'summary', component: PrototypeSummaryComponent },
      { path: 'confirmation', component: PrototypeConfirmationComponent },
      { path: 'registration', component: PrototypeRegistrationComponent },
      { path: 'password', component: PrototypePasswordComponent },
      { path: '', redirectTo: 'amount', pathMatch: 'full' }      
    ]
  }
];

export const prototypeRouting: ModuleWithProviders = RouterModule.forChild(prototypeRoutes);