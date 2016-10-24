import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DemoComponent } from './demo.component';
import { ContentComponent } from './content/content.component';
import { IframeComponent } from './iframe/iframe.component';

const demoRoutes: Routes = [
  {
    path: 'demo',
    component: DemoComponent,
    children: [
      { path: 'iframe', component: IframeComponent },
      { path: '', component: ContentComponent } 
    ]
  }
];

export const DemoRouting: ModuleWithProviders = RouterModule.forChild(demoRoutes);