import {Directive, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {PermissionFlags} from '../_enums/permission-flags.enum';
import {AuthService} from '../_services/auth.service';

@Directive({
  selector: '[appHasPermission]'
})
export class HasPermissionDirective implements OnInit {
  @Input() appHasPermission: PermissionFlags;

  constructor(private viewContainerRef: ViewContainerRef, private templateRef: TemplateRef<any>, private auth: AuthService) {
  }

  ngOnInit(): void {
    const userPermissions: PermissionFlags = this.auth.permissions;
this.viewContainerRef.element.nativeElement.
    console.log('req: ' + this.appHasPermission);
    console.log('userPermission converted: ' + this.auth.permissions);
    console.log('userPermission token: ' + this.auth.decodedToken.permissions);

    if (userPermissions & this.appHasPermission) {
      console.log('*** permission');
    } else {
      console.log('*** No Permission');
    }
  }

}
