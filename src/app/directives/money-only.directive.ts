import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[moneyOnly]'
})

export class MoneyOnlyDirective {

  public target;
  public regex: RegExp = new RegExp('[0-9\.]');

  constructor(private el: ElementRef) {
    this.target = this.el.nativeElement;
  }

  @HostListener('keypress', ['$event']) onKeypress(e) {
      return e.charCode === 0 || this.regex.test(String.fromCharCode(e.charCode));
  }

}
