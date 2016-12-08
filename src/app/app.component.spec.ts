/* tslint:disable:no-unused-variable */
import { async, inject, TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, JsonpModule } from '@angular/http';
import { PreloaderModule } from './preloader/preloader.module';
import { StateManagerService } from './services/state-manager.service';
import { QuickDonationAmountsService } from './services/quick-donation-amounts.service';
import { PreviousGiftAmountService } from './services/previous-gift-amount.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientService } from './services/http-client.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Angulartics2, Angulartics2GoogleTagManager } from 'angulartics2';
import { ParamValidationService } from './services/param-validation.service';

describe('App: CrdsEmbed', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppComponent ],
      imports: [
        PreloaderModule,
        RouterTestingModule.withRoutes([]),
        HttpModule,
        JsonpModule,
        ReactiveFormsModule
      ],
      providers: [
        QuickDonationAmountsService,
        HttpClientService,
        PreviousGiftAmountService,
        CookieService,
        StateManagerService,
        Angulartics2,
        Angulartics2GoogleTagManager,
        ParamValidationService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

});
