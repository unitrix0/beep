import {Injectable} from '@angular/core';

declare let alertify: any;

@Injectable({
  providedIn: 'root'
})

export class AlertifyService {

  constructor() {
    alertify.defaults.transition = 'slide';
    alertify.defaults.theme.ok = 'btn btn-sm btn-primary';
    alertify.defaults.theme.cancel = 'btn btn-sm btn-secondary';
    alertify.defaults.theme.input = 'form-control';
  }

  confirm(message: string, okCallback: () => any, cancelCallback?: () => void) {
    alertify.confirm('Beep!', message, okCallback, cancelCallback);
  }

  success(message: string) {
    alertify.success(message);
  }

  error(message: string) {
    alertify.alert('Bepp!', message);
  }

  warning(message: string) {
    alertify.warning(message);
  }

  message(message: string) {
    alertify.message(message);
  }
}
