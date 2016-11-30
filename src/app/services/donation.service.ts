import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Resolve } from '@angular/router';
import { CrdsDonor } from '../models/crds-donor';
import { CustomerBank } from '../models/customer-bank';
import { CustomerCard} from '../models/customer-card';
import { HttpClientService } from './http-client.service';
import { GiftService } from './gift.service';
import { PaymentService } from './payment.service';
import { PaymentCallBody } from '../models/payment-call-body';
import { StripeService } from './stripe.service';


import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class DonationService {

  private transactionUrl: string = process.env.CRDS_API_ENDPOINT;

  private bank: any;
  private card: any;

  constructor(private http: HttpClientService,
              private paymentService: PaymentService,
              private giftService: GiftService) { }



}
