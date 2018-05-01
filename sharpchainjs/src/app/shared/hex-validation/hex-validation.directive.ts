import { Directive, ElementRef, HostListener } from '@angular/core';
import { Validators } from '@angular/forms';

@Directive({
  selector: '[appHexValidation]'
})
export class HexValidationDirective {
  private hexPattern = new RegExp("^[a-fA-F0-9]+$");

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInput(event: any) {
    const value: string = this.el.nativeElement.value
    if (!value) return
    if (value.length % 2 !== 0) {
      this.highlight()
      return
    }
    if (!this.hexPattern.test(value)) {
      this.highlight()
      return
    }
    this.clear()
  }

  @HostListener('change', ['$event'])
  onChange(event: any) {
    console.log("changed");
  }

  private highlight(color: string = "red") {
    this.el.nativeElement.style.backgroundColor = color;
  }

  private clear(color: string = "white") {
    this.el.nativeElement.style.backgroundColor = color;
  }
}