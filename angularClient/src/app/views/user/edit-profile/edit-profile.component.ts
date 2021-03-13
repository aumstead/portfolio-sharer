import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { AppUser } from 'src/app/_models/appUser';
import { LoggedInUser } from 'src/app/_models/loggedInUser';
import { AccountService } from 'src/app/_services/account.service';
import { AppUserService } from 'src/app/_services/app-user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  pageUser: AppUser;
  loggedInUser: LoggedInUser;

  // edit form properties
  @ViewChild('editForm') editForm: NgForm;
  @HostListener('window:beforeunload', ['$event']) unloadNotification(
    $event: any
  ) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }
  bsConfig: Partial<BsDatepickerConfig>;
  maxDate: Date = new Date();
  validationErrors: string[] = [];

  // photo tab properties
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  uploadPhotoError = false;

  constructor(
    private _accountService: AccountService,
    private _appUserService: AppUserService,
    private _toastrService: ToastrService
  ) {
    this._accountService.currentUser$.pipe(take(1)).subscribe((user) => {
      this.loggedInUser = user;
    });
    this.bsConfig = Object.assign(
      {},
      {
        containerClass: 'theme-orange',
        dateInputFormat: 'YYYY-MM-DD',
        // dateInputFormat: 'MM/DD/YYYY',
        useUtc: false,
      }
    );
  }

  ngOnInit(): void {
    this.loadPageUser();
  }

  updateProfile() {
    this._appUserService.updateAppUser(this.pageUser).subscribe(
      () => {
        this._toastrService.success('Profile updated successfully');
        this.editForm.reset(this.pageUser);
      },
      (error) => {
        error.forEach((errorText, index) => {
          if (
            errorText.includes(
              'The JSON value could not be converted to System.DateTime'
            )
          ) {
            errorText = 'The date of birth format is invalid.';
            error[index] = errorText;
          }
        });
        this.validationErrors = error;
      }
    );
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: `${this.baseUrl}/users/add-photo`,
      authToken: 'Bearer ' + this.loggedInUser.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader._onErrorItem = (item, response, status, headers) => {
      console.error('Error uploading photo. Status: ' + status);
      this.uploadPhotoError = true;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo = JSON.parse(response);
        this.pageUser.photo = photo;
        this.loggedInUser.photoUrl = photo.url;
        this.uploadPhotoError = false;
        this._accountService.setCurrentUser(this.loggedInUser);
      }
    };
  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  loadPageUser() {
    this._appUserService
      .getAppUser(this.loggedInUser.username)
      .subscribe((user) => {
        this.pageUser = user;
        this.initializeUploader();
      });
  }
}
