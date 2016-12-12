import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PaymentComponent } from './payment/payment.component';
import { BillingComponent } from './billing/billing.component';
import { SummaryComponent } from './summary/summary.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { RegisterComponent } from './register/register.component';
import { FundAndFrequencyComponent } from './fund-and-frequency/fund-and-frequency.component';
import { DonationFundService } from './services/donation-fund.service';

const appRoutes: Routes = [
  { path: 'payment', redirectTo: '/', pathMatch: 'full' },
  { path: 'donation', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: PaymentComponent },
  { path: 'fund',
    component: FundAndFrequencyComponent,
    resolve: {
      giveTo: DonationFundService
    }
  },
  { path: 'auth', component: AuthenticationComponent },
  { path: 'billing', component: BillingComponent },
  { path: 'summary', component: SummaryComponent },
  { path: 'confirmation', component: ConfirmationComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', component: PageNotFoundComponent }
];

export const appRoutingProviders: any[] = [
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
