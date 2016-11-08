
import { Component, ViewEncapsulation, OnInit} from '@angular/core';
import { TransactionService } from './services/transaction.service';
import { UserSessionService } from './services/user-session.service';

import { Angulartics2 } from 'angulartics2';
import { Angulartics2GoogleTagManager } from 'angulartics2/dist/providers';

@Component({
  selector: 'app-root',
  template: '<div class="prototype-component container"><router-outlet></router-outlet></div>',
  styleUrls: ['../styles/application.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent implements OnInit {

  constructor(angulartics2: Angulartics2,
    angulartics2GoogleTagManager: Angulartics2GoogleTagManager,
    userSessionService: UserSessionService,
    transactionService: TransactionService) { }

  ngOnInit() {

  }

}
