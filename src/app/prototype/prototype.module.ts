import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrototypeComponent } from './prototype.component';
import { prototypeRouting } from './prototype.routing';
import { GiftAmountComponent } from './gift-amount/gift-amount.component';
import { AmountComponent } from './amount/amount.component';
import { DetailsComponent } from './details/details.component';
import { PrototypeAmountComponent } from './prototype-amount/prototype-amount.component';
import { PrototypeDetailsComponent } from './prototype-details/prototype-details.component';
import { PrototypeAuthenticationComponent } from './prototype-authentication/prototype-authentication.component';
import { PrototypePaymentComponent } from './prototype-payment/prototype-payment.component';
import { PrototypeSummaryComponent } from './prototype-summary/prototype-summary.component';
import { PrototypeConfirmationComponent } from './prototype-confirmation/prototype-confirmation.component';

@NgModule({
  imports: [
    CommonModule,
    prototypeRouting
  ],
  declarations: [PrototypeComponent, GiftAmountComponent, AmountComponent, DetailsComponent, PrototypeAmountComponent, PrototypeDetailsComponent, PrototypeAuthenticationComponent, PrototypePaymentComponent, PrototypeSummaryComponent, PrototypeConfirmationComponent]
})
export class PrototypeModule { }
