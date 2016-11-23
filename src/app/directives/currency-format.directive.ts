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
    if (this.isValidCurrency(String.fromCharCode(e.which))) {
      return true;
    } else {
      e.preventDefault();
      return false;
    }
  }

  @HostListener('paste', ['$event']) onPaste(e) {
    if (this.isValidCurrency(e.clipboardData.getData('Text'))) {
      return true;
    } else {
      e.preventDefault();
      return false;
    }
  }

  @HostListener('change', ['$event']) onChange(e) {
    this.isValidCurrency(String.fromCharCode(e.which));
  }

  @HostListener('input', ['$event']) onInput(e) {
    this.isValidCurrency(String.fromCharCode(e.which));
  }

  private isValidCurrency(input: string): boolean {
    let val = CreditCard.replaceFullWidthChars(this.target.value);

    // place new input value in the selected position,
    // replacing any value that exists there
    val = val.substring(0, this.target.selectionStart) + input + val.substring(this.target.selectionEnd);

    let regex: RegExp = new RegExp('^\\d{0,6}(\\.\\d{0,2})?$');
    return regex.test(val);
  }
}
