import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrototypeComponent } from './prototype.component';
import { PrototypeGiftAmountComponent } from './prototype-gift-amount/prototype-gift-amount.component';
import { PrototypeDetailsComponent } from './prototype-details/prototype-details.component';
import { PrototypeAuthenticationComponent } from './prototype-authentication/prototype-authentication.component';
import { PrototypeSummaryComponent } from './prototype-summary/prototype-summary.component';
import { PrototypePaymentComponent } from './prototype-payment/prototype-payment.component';
import { PrototypeConfirmationComponent } from './prototype-confirmation/prototype-confirmation.component';
import { PrototypeRegistrationComponent } from './prototype-registration/prototype-registration.component';
import { PrototypePasswordComponent } from './prototype-password/prototype-password.component';
import { PrototypeEmailComponent } from './prototype-email/prototype-email.component';

const prototypeRoutes: Routes = [
  {
    path: 'prototype',
    component: PrototypeComponent,
    children: [
      { path: '', redirectTo: 'gift', pathMatch: 'full' },
      {
        path: 'gift', children: [
          { path: 'amount', component: PrototypeGiftAmountComponent },
          { path: 'details', component: PrototypeDetailsComponent },
          { path: 'auth', component: PrototypeAuthenticationComponent },
          { path: 'payment', component: PrototypePaymentComponent },
          { path: 'summary', component: PrototypeSummaryComponent },
          { path: 'confirmation', component: PrototypeConfirmationComponent },
          { path: 'registration', component: PrototypeRegistrationComponent },
          { path: 'password', component: PrototypePasswordComponent },
          { path: 'email', component: PrototypeEmailComponent },
          { path: '', redirectTo: 'amount', pathMatch: 'full' }
        ]
      },
      {
        path: 'payment', children: [
          { path: 'amount', component: PrototypeGiftAmountComponent },
          { path: 'auth', component: PrototypeAuthenticationComponent },
          { path: 'payment', component: PrototypePaymentComponent },
          { path: 'summary', component: PrototypeSummaryComponent },
          { path: 'confirmation', component: PrototypeConfirmationComponent },
          { path: 'registration', component: PrototypeRegistrationComponent },
          { path: 'password', component: PrototypePasswordComponent },
          { path: 'email', component: PrototypeEmailComponent },
          { path: '', redirectTo: 'amount', pathMatch: 'full' }
        ]
      }
    ]

    // children: [
    //   { path: 'gift/amount', component: PrototypeGiftAmountComponent },
    //   // { path: 'payment/amount', component: PrototypeAmountComponent },
    //   { path: ':type/details', component: PrototypeDetailsComponent },
    //   { path: ':type/auth', component: PrototypeAuthenticationComponent },
    //   { path: ':type/payment', component: PrototypePaymentComponent },
    //   { path: ':type/summary', component: PrototypeSummaryComponent },
    //   { path: ':type/confirmation', component: PrototypeConfirmationComponent },
    //   { path: ':type/registration', component: PrototypeRegistrationComponent },
    //   { path: ':type/password', component: PrototypePasswordComponent },
    //   { path: ':type/email', component: PrototypeEmailComponent },
    //   { path: '', redirectTo: 'amount', pathMatch: 'full' }
    // ]
  }
];

export const prototypeRouting: ModuleWithProviders = RouterModule.forChild(prototypeRoutes);