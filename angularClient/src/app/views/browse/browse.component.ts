import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppUser } from 'src/app/_models/appUser';
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
  pageNumber = 1;
  pageSize = 5;

  constructor(private _appUserService: AppUserService) {}

  ngOnInit(): void {
    this.loadAppUsers();
  }

  loadAppUsers() {
    this._appUserService
      .getAppUsers(this.pageNumber, this.pageSize)
      .subscribe((response) => {
        this.appUsers = response.result;
        this.pagination = response.pagination;
      });
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.loadAppUsers();
  }
}
