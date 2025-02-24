import { StorageService } from './../service/storage.service';
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appRoleCheck]'
})
export class RoleCheckDirective {

  private currentUser: any;

  @Input() set appRoleCheck(roles: string[]) {
    this.currentUser = this.storageService.getFromLocalStore('user');
    this.updateView(roles);
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private storageService: StorageService
  ) { }

  private updateView(roles: string[]) {
    console.log('roles', roles);
    if (this.currentUser && roles.includes(this.currentUser.role)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

}
