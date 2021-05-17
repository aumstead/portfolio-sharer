import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { MessagesComponent } from '../views/user/messages/messages.component';
import { LoggedInUser } from '../_models/loggedInUser';
import { AccountService } from '../_services/account.service';
import { MessageService } from '../_services/message.service';
import { PresenceService } from '../_services/presence.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(
    public _accountService: AccountService,
    public _router: Router,
    public _messageService: MessageService
  ) {}

  currentUser: LoggedInUser;

  ngOnInit(): void {
    this._accountService.currentUser$.pipe(take(1)).subscribe((user) => {
      this.currentUser = user;
    });

    if (this.currentUser) {
      this._messageService.getUnreadMessages().subscribe((messages: any) => {
        this._messageService.numberOfUnreadMessages = messages.length;
      });
    }
  }

  logout() {
    this._accountService.logout();
    this._router.navigateByUrl('/');
  }

  // getRandomPhoto() {
  //   return '/assets/orange.jpg';
  // }

  reloadPage() {
    location.reload();
  }
}
