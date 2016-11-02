import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrototypeComponent } from './prototype.component';
import { PrototypeGiftAmountComponent } from './prototype-gift-amount/prototype-gift-amount.component';
import { PrototypePaymentAmountComponent } from './prototype-payment-amount/prototype-payment-amount.component';
import { PrototypeDetailsComponent } from './prototype-details/prototype-details.component';
import { PrototypeAuthenticationComponent } from './prototype-authentication/prototype-authentication.component';
import { PrototypeSummaryComponent } from './prototype-summary/prototype-summary.component';
import { PrototypeSwitchComponent } from './prototype-switch/prototype-switch.component';
import { PrototypePaymentComponent } from './prototype-payment/prototype-payment.component';
import { PrototypeConfirmationComponent } from './prototype-confirmation/prototype-confirmation.component';
import { PrototypeRegistrationComponent } from './prototype-registration/prototype-registration.component';
import { PrototypePasswordComponent } from './prototype-password/prototype-password.component';
import { PrototypeEmailComponent } from './prototype-email/prototype-email.component';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { QuickDonationAmountsService } from '../services/quick-donation-amounts.service';
import { DonationFundService } from '../services/donation-fund.service';
import { PreviousGiftAmountService } from '../services/previous-gift-amount.service';
import { ExistingPaymentInfoService } from '../services/existing-payment-info.service';

const prototypeRoutes: Routes = [
  {
    path: 'prototype',
    component: PrototypeComponent,
    children: [
      { path: '', redirectTo: 'gift', pathMatch: 'full' },
      { path: 'switch', component: PrototypeSwitchComponent },
      {
        path: 'gift', children: [
          { path: 'amount',
            component: PrototypeGiftAmountComponent,
            resolve: {
              quickDonationAmounts: QuickDonationAmountsService,
              previousGiftAmount: PreviousGiftAmountService,
              existingPaymentInfo: ExistingPaymentInfoService
            }
          },
          { path: 'details',
            component: PrototypeDetailsComponent,
            resolve: {
              giveTo: DonationFundService
            }
          },
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
          { path: 'amount',
            component: PrototypePaymentAmountComponent,
            resolve: {
              existingPaymentInfo: ExistingPaymentInfoService
            }
          },
          { path: 'auth', component: PrototypeAuthenticationComponent },
          { path: 'payment', component: PrototypePaymentComponent },
          { path: 'summary', component: PrototypeSummaryComponent },
          { path: 'confirmation', component: PrototypeConfirmationComponent },
          { path: 'registration', component: PrototypeRegistrationComponent },
          { path: 'password', component: PrototypePasswordComponent },
          { path: 'email', component: PrototypeEmailComponent },
          { path: 'details', redirectTo: 'amount', pathMatch: 'full' },
          { path: '', redirectTo: 'amount', pathMatch: 'full' }
        ]
      }
    ]
  }
];

export const prototypeRouting: ModuleWithProviders = RouterModule.forChild(prototypeRoutes);
