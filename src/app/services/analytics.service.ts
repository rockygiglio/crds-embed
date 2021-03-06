import { Injectable } from '@angular/core';
import { Angulartics2 } from 'angulartics2';
import { IFrameParentService } from './iframe-parent.service';

@Injectable()
export class AnalyticsService {

  private analytics: Angulartics2;
  constructor(private angulartics2: Angulartics2,
    private iFrameParentService: IFrameParentService) {
    this.analytics = angulartics2;
  }

  public giveModalViewed() {
    let parentUrl = this.getParentUrlFormatted();
    this.analytics.eventTrack.next({
      action: 'GiveModalViewed',
      properties: {
        Url: parentUrl
      }
    });
  }

  public giveAmountEntered(amount: number, donationType: string, specificInitiative: string, usedSuggested: boolean) {
    let parentUrl = this.getParentUrlFormatted();
    this.analytics.eventTrack.next({ 
      action: 'GiveAmountEntered', 
      properties: { 
        Amount: amount,
        UsedSuggested: usedSuggested,
        DonationType: donationType,
        SpecificInitiative: specificInitiative,
        Url: parentUrl
      } 
    });
  }

  public paymentDetailsEntered(fundingMethod: string, email: string, checkoutType: string) {
    let parentUrl = this.getParentUrlFormatted();
    this.analytics.eventTrack.next({ 
      action: 'PaymentDetailsEntered', 
      properties: {
        FundingMethod: fundingMethod,
        Url: parentUrl,
        Email: email,
        CheckoutType: checkoutType
      } 
    });
  }

  public paymentSucceededClientSide(fundingMethod: string, email: string, checkoutType: string, amount: number) {
    let parentUrl = this.getParentUrlFormatted();
    this.analytics.eventTrack.next({ 
      action: 'PaymentSucceededClientSide', 
      properties: { 
        FundingMethod: fundingMethod,
        Url: parentUrl,
        Email: email,
        CheckoutType: checkoutType,
        Amount: amount
      } 
    });
  }

  public trackAmountSubmitted(amount: number) {
      this.analytics.eventTrack.next({ action: 'Submitted', properties: { category: 'amountDonation', value: amount } });
  }

  private getParentUrlFormatted() : string {
    let u = this.iFrameParentService.getIFrameParentUrl();
    return u.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "");
  }
}
