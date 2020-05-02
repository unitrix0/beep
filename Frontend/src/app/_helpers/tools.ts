import {ElementRef} from '@angular/core';

export abstract class Tools {
  public static ScrollToElement(elem: ElementRef) {
    elem.nativeElement.scrollIntoView({behavior: 'smooth'});
  }
}
