import { Directive, ElementRef, HostListener } from '@angular/core';
import { CreditCard } from '../shared/credit-card';

@Directive({
  selector: '[ccCVV]'
})

export class CvvFormatDirective {

  public target;

  constructor(private el: ElementRef) {
    this.target = this.el.nativeElement;
  }

  @HostListener('keypress', ['$event']) onKeypress(e) {
    if (!CreditCard.restrictNumeric(e) && !CreditCard.restrictCvv(e.which, this.target)) {
      e.preventDefault();
    }
  }
  @HostListener('paste', ['$event']) onPaste(e) {
    this.reformatCvv(e)
  }
  @HostListener('change', ['$event']) onChange(e) {
    this.reformatCvv(e)
  }
  @HostListener('input', ['$event']) onInput(e) {
    this.reformatCvv(e)
  }


  private reformatCvv(e) {
    setTimeout(() => {
      let val = CreditCard.replaceFullWidthChars(this.target.value);
      val = val.replace(/\D/g, '').slice(0, 4);
      this.target.selectionStart = this.target.selectionEnd = CreditCard.safeVal(val, this.target);
    });
  }

}
