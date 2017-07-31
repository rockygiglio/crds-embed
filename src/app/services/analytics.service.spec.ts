import { TestBed, inject } from '@angular/core/testing';

import { AnalyticsService } from './analytics.service';
import { Angulartics2 } from 'angulartics2';

describe('AnalyticsService', () => {
  const mockAngulartics2Service = jasmine.createSpyObj<Angulartics2>('angulartics2', ['']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AnalyticsService,
        { provide: Angulartics2, useValue: mockAngulartics2Service },
      ]
    });
  });

  it('should create service', inject([AnalyticsService], (service: AnalyticsService) => {
    expect(service).toBeTruthy();
  }));
});
