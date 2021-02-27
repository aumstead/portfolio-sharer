import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppUser } from 'src/app/_models/appUser';
import { AppUserService } from 'src/app/_services/app-user.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css'],
})
export class BrowseComponent implements OnInit {
  appUsers$: Observable<AppUser[]>;

  constructor(private _appUserService: AppUserService) {}

  ngOnInit(): void {
    this.appUsers$ = this._appUserService.getAppUsers();
  }
}
