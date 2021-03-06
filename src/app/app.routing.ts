import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AmountComponent } from './amount/amount.component';
import { BillingComponent } from './billing/billing.component';
import { SummaryComponent } from './summary/summary.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { RegisterComponent } from './register/register.component';
import { FundAndFrequencyComponent } from './fund-and-frequency/fund-and-frequency.component';


export const appRoutes: Routes = [
  { path: '', component: AmountComponent },
  { path: 'amount', component: AmountComponent },
  { path: 'fund', component: FundAndFrequencyComponent },
  { path: 'authentication', component: AuthenticationComponent },
  { path: 'billing', component: BillingComponent },
  { path: 'signin', component: AuthenticationComponent },
  { path: 'summary', component: SummaryComponent },
  { path: 'confirmation', component: ConfirmationComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', component: PageNotFoundComponent }
];

export const appRoutingProviders: any[] = [
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
