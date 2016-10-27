import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PrototypeStore } from '../prototype-state/prototype.store';
import * as PrototypeActions from '../prototype-state/prototype.action-creators';
import { PrototypeGiftService } from '../prototype-gift.service';
import { ActivatedRoute } from '@angular/router';
import { ExistingPaymentInfoService } from '../../services/existing-payment-info.service';

@Component({
  selector: 'app-prototype-amount',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './prototype-gift-amount.component.html',
  styleUrls: ['./prototype-gift-amount.component.css']
})

export class PrototypeGiftAmountComponent implements OnInit {
  public predefinedAmounts: number[];
  public previousAmount: number;
  public selectedAmount: string;
  public customAmount: number;
  public form: FormGroup;
  public isDataLoaded: boolean = false;
  public previous: number = 20;
  public loggedInUser: any;
  public pmtInfo: any;

  constructor(@Inject(PrototypeStore) private store: any,
              private route: ActivatedRoute,
              private gift: PrototypeGiftService,
              private existingPaymentInfoService: ExistingPaymentInfoService,
              private _fb: FormBuilder) {}

  ngOnInit() {
    this.predefinedAmounts = this.route.snapshot.data['quickDonationAmounts'];
    this.previousAmount = this.route.snapshot.data['previousGiftAmount'];

    if (this.predefinedAmounts.indexOf(this.gift.amount) === -1) {
      this.customAmount = this.gift.amount;
    }

    this.form = this._fb.group({
      amount: [this.gift.amount, [<any>Validators.required]],
      customAmount: [this.gift.amount, [<any>Validators.pattern('^0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*$')]],
      selectedAmount: [this.gift.amount]
    });
  }

    //-------------------------------------------------------------------------------------------------------------------
    test(){

        console.log('Starting test');
        this.existingPaymentInfoService.getTestUser()
            .subscribe(
                loggedInUser => this.loggedInUser = loggedInUser,
                loggedInUser =>  this.loggedInUser = loggedInUser);
        console.log('Emit from subscribe');
        console.log(this.loggedInUser);

        if (this.loggedInUser){
            this.existingPaymentInfoService.getExistingPaymentInfo(this.loggedInUser.userToken)
                .subscribe(
                    pmtInfo => this.pmtInfo = pmtInfo,
                    pmtInfo =>  this.pmtInfo = pmtInfo);
            console.log(this.pmtInfo);
        }

    }
    //-------------------------------------------------------------------------------------------------------------------

  next() {
    this.gift.init = false;
    if (this.gift.amount) {
      this.store.dispatch(PrototypeActions.render(this.gift.flow_type + '/details'));
    }
    return false;
  }

  onCustomAmount(newValue) {
    if (!isNaN(newValue)) {
      delete(this.selectedAmount);
      this.setAmount(newValue);
    }
  }

  onSelectAmount(event, newValue) {
    delete(this.customAmount);
    this.setAmount(newValue);
  }

  setAmount(newValue) {
    (<FormControl>this.form.controls['amount']).setValue(newValue, { onlySelf: true });
    this.gift.amount = parseInt(newValue, 10);
  }

}
