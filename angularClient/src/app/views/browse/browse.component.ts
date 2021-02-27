import { Component, OnInit } from '@angular/core';
import { AppUser } from 'src/app/_models/appUser';
import { AppUserService } from 'src/app/_services/app-user.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css'],
})
export class BrowseComponent implements OnInit {
  appUsers: AppUser[];

  constructor(private _appUserService: AppUserService) {}

  ngOnInit(): void {
    this.loadAppUsers();
  }

  loadAppUsers() {
    this._appUserService.getAppUsers().subscribe((appUsers) => {
      this.appUsers = appUsers;
    });
  }
}
