import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrototypeComponent } from './prototype/prototype.component';
import { DemoComponent } from './demo/demo.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/prototype/amount', pathMatch: 'full' },
  { path: 'demo', component: DemoComponent },
  { path: '**', component: PageNotFoundComponent }
];

export const appRoutingProviders: any[] = [
]; 

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);