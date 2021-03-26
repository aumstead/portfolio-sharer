import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoggedInUser } from '../_models/loggedInUser';
import { MessageService } from './message.service';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<LoggedInUser>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(
    private _http: HttpClient,
    private _presence: PresenceService,
    private _messageService: MessageService
  ) {}

  login(model: any) {
    return this._http.post(`${this.baseUrl}/account/login`, model).pipe(
      map((response: LoggedInUser) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
          this._presence.createHubConnection(user);
          // this._messageService
          //   .getUnreadMessages()
          //   .subscribe((messages: any) => {
          //     if (messages.length > 0)
          //       this._messageService.hasUnreadMessages = true;
          //   });
        }
      })
    );
  }

  register(model: any) {
    return this._http.post(`${this.baseUrl}/account/register`, model).pipe(
      map(
        (response: LoggedInUser) => {
          const user = response;
          if (user) {
            this.setCurrentUser(user);
            this._presence.createHubConnection(user);
          }
          return user;
        },
        (error) => console.log(error)
      )
    );
  }

  setCurrentUser(user: LoggedInUser) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this._presence.stopHubConnection();
    this._messageService.numberOfUnreadMessages = 0;
  }
}
