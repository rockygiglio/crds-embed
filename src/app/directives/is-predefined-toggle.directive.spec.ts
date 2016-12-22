/* tslint:disable:no-unused-variable */
import { Component, OnInit } from '@angular/core';
import { Angulartics2 } from 'angulartics2';
import { By } from '@angular/platform-browser';
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';
import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, JsonpModule  } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap';
import { AmountComponent } from '../amount/amount.component';
import { APIService } from '../services/api.service';
import { ContentService } from '../services/content.service';
import { IFrameParentService } from '../services/iframe-parent.service';
import { IsPredefinedToggleDirective } from '../directives/is-predefined-toggle.directive';
import { SessionService } from '../services/session.service';
import { StateService } from '../services/state.service';
import { StoreService } from '../services/store.service';
import { ValidationService } from '../services/validation.service';

@Component({
  selector: 'app-my-test-component',
  template: `<button isPredefinedToggle [inputType]="'predefinedAmount'">2</button>`
})
class TestComponent {
  constructor(
    private store: StoreService
  ) {}
}

describe('IsPredefinedToggle Directive', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        AmountComponent,
        IsPredefinedToggleDirective
      ],
      imports: [
        AlertModule,
        RouterTestingModule.withRoutes([]),
        HttpModule,
        JsonpModule,
        ReactiveFormsModule
      ],
      providers: [
        IFrameParentService,
        StoreService,
        ValidationService,
        StateService,
        APIService,
        SessionService,
        CookieService,
        ContentService,
        Angulartics2
      ]
    });
    this.fixture = TestBed.createComponent(TestComponent);
    this.component = this.fixture.componentInstance;

  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

  xit('should set value in store service when clicked', () => {
    this.component.store.setIsPredefined(false);
    let btnElement = this.fixture.debugElement.queryAll(By.directive(IsPredefinedToggleDirective));
    // ToDo: btnElement is undefined, should be fixed
    btnElement.dispatchEvent(new Event('click'));
    this.component.fixture.detectChanges();

    expect(this.component.store.isPredefined).toBe(true);
  });

});
