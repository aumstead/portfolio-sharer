import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { EditProfileComponent } from '../views/user/edit-profile/edit-profile.component';

@Injectable({
  providedIn: 'root',
})
export class PreventUnsavedChangesGuard implements CanDeactivate<unknown> {
  canDeactivate(component: EditProfileComponent): boolean {
    if (component.editForm.dirty) {
      return confirm(
        'Are you sure you want to continue? Any unsaved changes will be lost.'
      );
    }
    return true;
  }
}
