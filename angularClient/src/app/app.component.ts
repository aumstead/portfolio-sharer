import { Component, OnInit } from '@angular/core';
import { LoggedInUser } from './_models/loggedInUser';
import { AccountService } from './_services/account.service';
import { PresenceService } from './_services/presence.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'client';
  users: any;

  constructor(
    private _accountService: AccountService,
    private _presence: PresenceService
  ) {}
  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const user: LoggedInUser = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this._accountService.setCurrentUser(user);
      this._presence.createHubConnection(user);
    }
  }
}
