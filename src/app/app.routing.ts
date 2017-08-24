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
  { path: 'give', component: AmountComponent },
  { path: 'give/amount', component: AmountComponent },
  { path: 'give/fund', component: FundAndFrequencyComponent },
  { path: 'give/authentication', component: AuthenticationComponent },
  { path: 'give/billing', component: BillingComponent },
  { path: 'give/signin', component: AuthenticationComponent },
  { path: 'give/summary', component: SummaryComponent },
  { path: 'give/confirmation', component: ConfirmationComponent },
  { path: 'give/register', component: RegisterComponent },
  { path: '**', component: PageNotFoundComponent }
];

export const appRoutingProviders: any[] = [
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
