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
import { AddMeToMapMapComponent } from './add-me-to-map/add-me-to-map.component';
import { LoggedInGuard } from './route-guards/logged-in-guard';
import { UserDataResolver } from './route-resolvers/user-data-resolver';

export const appRoutes: Routes = [
  { path: '', component: AmountComponent },
  { path: 'amount', component: AmountComponent },
  { path: 'fund', component: FundAndFrequencyComponent },
  { path: 'authentication', component: AuthenticationComponent },
  { path: 'billing', component: BillingComponent },
  { path: 'summary', component: SummaryComponent },
  { path: 'confirmation', component: ConfirmationComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', component: PageNotFoundComponent },
  {
    path: 'add-me-to-the-map',
    component: AddMeToMapMapComponent,
    canActivate: [
      LoggedInGuard
    ],
    resolve: {
      userData: UserDataResolver,
      stateList: UserDataResolver
    }
  }
];

export const appRoutingProviders: any[] = [
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
