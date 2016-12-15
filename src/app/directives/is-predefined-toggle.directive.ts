import { Directive, ElementRef, HostListener, Input } from '@angular/core';

import { StoreService } from '../services/store.service';

@Directive({
  selector: '[isPredefinedToggle]'
})

export class IsPredefinedToggleDirective {

  public target;

  public inputTypes = {
    predefinedAmount: 'predefinedAmount',
    customAmount: 'customAmount'
  };

  constructor(private el: ElementRef,
              private store: StoreService) {
    this.target = this.el.nativeElement;
  }

  @Input('inputType') inputType: string;

  @HostListener('click', ['$event']) onClick(e) {

    let isClickingPredefinedAmt = this.inputType === this.inputTypes.predefinedAmount;

    if(isClickingPredefinedAmt) {
      this.setIsPredefinedInStore(this.inputType);
    }

  }

  @HostListener('paste', ['$event']) onPaste(e) {
    this.setIsPredefinedAfterPasteValidation();
  }

  @HostListener('input', ['$event']) onInput(e) {
    this.setIsPredefinedInStore(this.inputType);
  }

  private setIsPredefinedAfterPasteValidation() {
    setTimeout(() => {
      let isPasteValidAmount: boolean = Boolean(this.target.value);
      if(isPasteValidAmount) {
        this.setIsPredefinedInStore(this.inputType);
      }
    }, 1);
  }

  private setIsPredefinedInStore(lastInputType: string) {
    let isPredefined: boolean = lastInputType === this.inputTypes.predefinedAmount;
    isPredefined ? this.store.setIsPredefined(true) : this.store.setIsPredefined(false);
  };

}