import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[simpleCcNumber]'
})

export class SimpleCreditCardFormatDirective {

  public target;
  public position;

  constructor(private el: ElementRef) {
    this.target = this.el.nativeElement;
  }

  @HostListener('keypress', ['$event']) onKeyup(e) {
    this.position = this.target.selectionStart;

    this.target.value = this.target.value.replace(/[^0-9]/g, '');
    this.target.selectionEnd = this.position;
  }
}

