import {ElementRef} from '@angular/core';

export abstract class Tools {
  public static ScrollToElement(elem: ElementRef) {
    elem.nativeElement.scrollIntoView({behavior: 'smooth'});
  }

  public static round(value, precision) {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }
}

