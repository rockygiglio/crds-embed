import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrototypeComponent } from './prototype.component';

const prototypeRoutes: Routes = [
  { path: 'prototype',  component: PrototypeComponent }
];

export const prototypeRouting: ModuleWithProviders = RouterModule.forChild(prototypeRoutes);