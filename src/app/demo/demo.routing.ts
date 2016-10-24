import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DemoComponent } from './demo.component';
import { IframeComponent } from './iframe.component';

const demoRoutes: Routes = [
  {
    path: 'prototype',
    component: DemoComponent,
    children: [
      { path: 'iframe', component: IframeComponent }  
    ]
  }
];

export const DemoRouting: ModuleWithProviders = RouterModule.forChild(demoRoutes);