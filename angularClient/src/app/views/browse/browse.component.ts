import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppUser } from 'src/app/_models/appUser';
import { AppUserParams } from 'src/app/_models/appUserParams';
import { Pagination } from 'src/app/_models/pagination';
import { AppUserService } from 'src/app/_services/app-user.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css'],
})
export class BrowseComponent implements OnInit {
  appUsers: AppUser[];
  pagination: Pagination;
  appUserParams: AppUserParams = new AppUserParams();

  constructor(private _appUserService: AppUserService) {}

  ngOnInit(): void {
    this.loadAppUsers();
  }

  loadAppUsers() {
    console.log('in load app users', this.appUserParams.minAge);
    this._appUserService
      .getAppUsers(this.appUserParams)
      .subscribe((response) => {
        this.appUsers = response.result;
        this.pagination = response.pagination;
      });
  }

  pageChanged(event: any) {
    this.appUserParams.pageNumber = event.page;
    this.loadAppUsers();
  }

  resetFilters(e) {
    e.preventDefault();
    this.appUserParams = new AppUserParams();
    this.loadAppUsers();
  }
}
