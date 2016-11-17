import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { StateManagerService } from '../services/state-manager.service';
import { GiftService } from '../services/gift.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'payment.component.html',
  styleUrls: ['payment.component.css']
})
export class PaymentComponent implements OnInit {
  public amountDue: Array<Object>;
  public customAmount: number;
  public form: FormGroup;
  public selectedAmount: string;
  public submitted: boolean = false;

  constructor(private fb: FormBuilder,
              private gift: GiftService,
              private router: Router,
              private stateManagerService: StateManagerService) {
  }

  ngOnInit() {
    this.stateManagerService.is_loading = false;

    this.amountDue = [
      {
        label: 'Minimum Due',
        amount: this.gift.minPayment
      },
      {
        label: 'Total Due',
        amount: this.gift.totalCost
      }
    ];

    this.form = this.fb.group({
      amount: [this.gift.amount, [<any>Validators.required, this.validateAmount.bind(this)]],
      customAmount: [this.gift.amount, [<any>Validators.required, this.validateAmount.bind(this)]],
      selectedAmount: [this.gift.amount]
    });
  }

  isValid() {
    return this.form.valid || this.gift.validAmount();
  }

  next() {
    this.submitted = true;
    this.router.navigateByUrl(this.stateManagerService.getNextPageToShow(this.stateManagerService.paymentIndex));
    return false;
  }

  onCustomAmount(value) {
    if (!isNaN(value)) {
      delete(this.selectedAmount);
      this.setAmount(value);
    }
  }

  onSelectAmount(event, value) {
    delete(this.customAmount);
    this.setAmount(value);
  }

  setAmount(value) {
    (<FormControl>this.form.controls['amount']).setValue(value, { onlySelf: true });
    this.gift.amount = parseFloat(value);
  }

  private validateAmount(control) {
    return this.gift.validAmount() ? null : {
      validateAmount: true
    };
  }

}
