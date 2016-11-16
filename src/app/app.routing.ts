import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PaymentComponent } from './payment/payment.component';
import { BillingComponent } from './billing/billing.component';
import { SummaryComponent } from './summary/summary.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { AuthenticationComponent } from './authentication/authentication.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/payment', pathMatch: 'full' },
  { path: 'payment', component: PaymentComponent },
  { path: 'auth', component: AuthenticationComponent },
  { path: 'billing', component: BillingComponent },
  { path: 'summary', component: SummaryComponent },
  { path: 'confirmation', component: ConfirmationComponent },
  { path: '**', component: PageNotFoundComponent }
];

export const appRoutingProviders: any[] = [
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
