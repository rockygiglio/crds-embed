import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DonationComponent } from './donation/donation.component';
import { PaymentComponent } from './payment/payment.component';
import { BillingComponent } from './billing/billing.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/payment', pathMatch: 'full' },
  { path: 'payment', component: PaymentComponent },
  { path: 'donation', component: DonationComponent },
  { path: 'billing', component: BillingComponent },
  { path: '**', component: PageNotFoundComponent }
];

export const appRoutingProviders: any[] = [
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
