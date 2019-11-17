import {Directive, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {PermissionFlags} from '../_enums/permission-flags.enum';
import {PermissionsService} from '../_services/permissions.service';

@Directive({
  selector: '[appShowOnPermission]'
})
export class ShowOnPermissionDirective implements OnInit {
  @Input() appShowOnPermission: PermissionFlags;

  constructor(private viewContainerRef: ViewContainerRef, private templateRef: TemplateRef<any>, private permissions: PermissionsService) {
  }

  ngOnInit(): void {
    if (this.permissions.hasPermissionOr(this.appShowOnPermission)) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
  }

}
