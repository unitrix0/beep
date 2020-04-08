import {Directive, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[appHoverClass]'
})
export class HoverClassDirective {

  @Input('appHoverClass') hoverClass: string;
  @Input('hoverClassTarget') hoverClassTarget: HTMLElement;

  @HostListener('mouseenter') onMouseEnter() {
    this.hoverClassTarget.classList.add(this.hoverClass);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.hoverClassTarget.classList.remove(this.hoverClass);
  }
}
