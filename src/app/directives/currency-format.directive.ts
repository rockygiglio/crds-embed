import { Directive, ElementRef, HostListener } from '@angular/core';
import { CreditCard } from '../shared/credit-card';

@Directive({
  selector: '[currency]'
})

export class CurrencyFormatDirective {

  public target;

  constructor(private el: ElementRef) {
    this.target = this.el.nativeElement;
  }

  @HostListener('keypress', ['$event']) onKeypress(e) {

    if (this.isValidCurrency(e)) {
      return true;
    } else {
      e.preventDefault();
      return false;
    }
  }
  @HostListener('paste', ['$event']) onPaste(e) {
    console.log(e.clipboardData.getData('Text'));
    this.isValidCurrency(e);
  }
  @HostListener('change', ['$event']) onChange(e) {
    this.isValidCurrency(e);
  }
  @HostListener('input', ['$event']) onInput(e) {
    this.isValidCurrency(e);
  }

  private isValidCurrency(e): boolean {
    let input;
    let keypress = e.which;
    let val = CreditCard.replaceFullWidthChars(this.target.value);
    input = String.fromCharCode(keypress);

    // place new input value in the selected position,
    // replacing any value that exists there
    val = val.substring(0, this.target.selectionStart) + input + val.substring(this.target.selectionEnd);

    let regex: RegExp = new RegExp('^\\d{0,6}(\\.\\d{0,2})?$');
    return regex.test(val);
  }
}
