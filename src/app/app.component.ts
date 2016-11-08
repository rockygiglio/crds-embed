import { Component, ViewEncapsulation, OnInit} from '@angular/core';
import { TransactionService } from './services/transaction.service';
import { UserSessionService } from './services/user-session.service';

@Component({
  selector: 'app-root',
  template: '<div class="prototype-component container"><router-outlet></router-outlet></div>',
  styleUrls: ['../styles/application.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  constructor(userSessionService: UserSessionService, transactionService: TransactionService) { }

  ngOnInit() {

  }
}
