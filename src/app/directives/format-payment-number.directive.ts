import { Directive, ElementRef, HostListener } from '@angular/core';
import { KeypressValidation } from '../shared/keypress-validation';

@Directive({
  selector: '[formatPaymentNumber]'
})

export class FormatPaymentNumberDirective {

  public target;
  public position;

  constructor(private el: ElementRef) {
    this.target = this.el.nativeElement;
  }

  @HostListener('paste', ['$event']) onPaste(e) {
    if (KeypressValidation.isNonValidationKeypress(e)) {
      return true;
    }
    if ( this.isValidInput(e.clipboardData.getData('Text')) ) {
      this.inputData(e);
    } else {
      return false;
    }
  }

  @HostListener('keypress', ['$event']) onKeypress(e) {
    if (KeypressValidation.isNonValidationKeypress(e)) {
      return true;
    }
    if ( this.isValidInput(String.fromCharCode(e.which)) ) {
      this.inputData(e);
    } else {
      e.preventDefault();
      return false;
    }
  }

  private isValidInput(input: string): boolean {
    let val = KeypressValidation.replaceFullWidthChars(this.target.value);

    val = val.substring(0, this.target.selectionStart) + input + val.substring(this.target.selectionEnd);
    let regex: RegExp = new RegExp('^\\d+$');
    return regex.test(val);
  }

  private inputData(target): void {
    this.position = target.selectionStart;
    if ( target.value ) {
      target.value = target.value.replace(/[^0-9]/g, '');
    }
    target.selectionEnd = this.position;
  }
}
