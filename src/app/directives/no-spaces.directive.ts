import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[noSpaces]'
})

export class NoSpacesDirective {

  public target;

  constructor(private el: ElementRef) {
    this.target = this.el.nativeElement;
  }

  @HostListener('paste', ['$event']) onPaste(e) {
    this.removeSpaces(e);
  }
  @HostListener('input', ['$event']) onInput(e) {
    this.removeSpaces(e);
  }

  private removeSpaces(e) {
    setTimeout(() => {
      let val = this.target.value;
      val = val.replace(/\D/g, '');
      this.target.value = val;
    });
  }
}
