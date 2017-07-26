import { Injectable } from '@angular/core';
import { Angulartics2 } from 'angulartics2';

@Injectable()
export class AnalyticsService {

 private analytics: Angulartics2;
  constructor(private angulartics2: Angulartics2 ) {
    this.analytics = angulartics2;
  }
  // EXAMPLE OF ANGULARTICS EVENT CALL
  // testCall(){
  //   this.analytics.eventTrack.next({action: "THIS IS AN EMBED TEST", properties: {}});
  // }

}
