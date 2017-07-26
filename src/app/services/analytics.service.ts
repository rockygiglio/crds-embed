import { Injectable } from '@angular/core';
import { Angulartics2Segment } from 'angulartics2';

@Injectable()
export class AnalyticsService {

 private analytics: Angulartics2Segment;
  constructor(private angulartics2Segment: Angulartics2Segment ) {
    this.analytics = angulartics2Segment;
  }
  // EXAMPLE OF ANGULARTICS EVENT CALL
  // testCall(){
  //   this.analytics.eventTrack("THIS IS AN EMBED TEST", {});
  // }

}
