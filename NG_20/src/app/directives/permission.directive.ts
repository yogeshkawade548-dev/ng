import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { PermissionService } from '../services/permission.service';

@Directive({
  selector: '[appPermission]',
  standalone: true
})
export class PermissionDirective implements OnInit {
  @Input() appPermission!: string; // e.g., 'User Management'
  @Input() permissionType: 'view' | 'create' | 'edit' | 'delete' | 'download' = 'view';

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissionService: PermissionService
  ) {}

  ngOnInit() {
    this.checkPermission();
  }

  private checkPermission() {
    this.permissionService.getComponentPermissions(this.appPermission).subscribe({
      next: (permissions) => {
        const hasPermission = this.getPermissionValue(permissions);
        if (hasPermission) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      },
      error: () => {
        this.viewContainer.clear();
      }
    });
  }

  private getPermissionValue(permissions: any): boolean {
    switch (this.permissionType) {
      case 'view': return permissions.canView;
      case 'create': return permissions.canCreate;
      case 'edit': return permissions.canEdit;
      case 'delete': return permissions.canDelete;
      case 'download': return permissions.canDownload;
      default: return false;
    }
  }
}