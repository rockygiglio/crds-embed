import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DonationComponent } from "./donation/donation.component";
import { PaymentComponent } from "./payment/payment.component";

const appRoutes: Routes = [
  { path: '', redirectTo: '/payment', pathMatch: 'full' },
  { path: 'payment', component: PaymentComponent },
  { path: 'donation', component: DonationComponent },
  { path: '**', component: PageNotFoundComponent }
];

export const appRoutingProviders: any[] = [
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
