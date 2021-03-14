import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppUser } from 'src/app/_models/appUser';
import { AppUserParams } from 'src/app/_models/appUserParams';
import { Pagination } from 'src/app/_models/pagination';
import { AccountService } from 'src/app/_services/account.service';
import { AppUserService } from 'src/app/_services/app-user.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css'],
})
export class BrowseComponent implements OnInit {
  appUsers: AppUser[];
  pagination: Pagination;
  appUserParams: AppUserParams;

  constructor(private _appUserService: AppUserService) {
    this.appUserParams = _appUserService.appUserParams;
  }

  ngOnInit(): void {
    this.loadAppUsers();
  }

  loadAppUsers() {
    this._appUserService.setAppUserParams(this.appUserParams);
    this._appUserService
      .getAppUsers(this.appUserParams)
      .subscribe((response) => {
        this.appUsers = response.result;
        this.pagination = response.pagination;
      });
  }

  pageChanged(event: any) {
    this.appUserParams.pageNumber = event.page;
    this._appUserService.setAppUserParams(this.appUserParams);
    this.loadAppUsers();
  }

  resetFilters(e) {
    e.preventDefault();
    this.appUserParams = this._appUserService.resetAppUserParams();
    this.loadAppUsers();
  }

  setOrderByDisplayName(propName: string) {
    switch (propName) {
      case 'created':
        return 'Newest members';
      case 'lastActive':
        return 'Last active';
      default:
        console.error('Error in switch.');
        return 'Select';
    }
  }
}
