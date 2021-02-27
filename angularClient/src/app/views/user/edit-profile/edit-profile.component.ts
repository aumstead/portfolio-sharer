import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { AppUser } from 'src/app/_models/appUser';
import { LoggedInUser } from 'src/app/_models/loggedInUser';
import { AccountService } from 'src/app/_services/account.service';
import { AppUserService } from 'src/app/_services/app-user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  pageUser: AppUser;
  loggedInUser: LoggedInUser;
  @ViewChild('editForm') editForm: NgForm;
  @HostListener('window:beforeunload', ['$event']) unloadNotification(
    $event: any
  ) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(
    private _accountService: AccountService,
    private _appUserService: AppUserService,
    private _toastrService: ToastrService
  ) {
    this._accountService.currentUser$
      .pipe(take(1))
      .subscribe((user) => (this.loggedInUser = user));
  }

  ngOnInit(): void {
    this.loadPageUser();
  }

  loadPageUser() {
    this._appUserService
      .getAppUser(this.loggedInUser.username)
      .subscribe((user) => {
        this.pageUser = user;
      });
  }

  updateProfile() {
    this._appUserService.updateAppUser(this.pageUser).subscribe(() => {
      this._toastrService.success('Profile updated successfully');
      this.editForm.reset(this.pageUser);
    });
  }
}
