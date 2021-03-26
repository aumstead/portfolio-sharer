import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { LoggedInUser } from '../_models/loggedInUser';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MessageService } from './message.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection: HubConnection;
  // private onlineUsersSource = new BehaviorSubject<string[]>([]);
  // onlineUsers$ = this.onlineUsersSource.asObservable();

  constructor(
    private _toastr: ToastrService,
    private _router: Router,
    private _messageService: MessageService
  ) {}

  createHubConnection(loggedInUser: LoggedInUser) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this.hubUrl}/presence`, {
        accessTokenFactory: () => loggedInUser.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch((error) => console.log(error));

    // this.hubConnection.on('UserIsOnline', (username) => {
    //   console.log('in user is online');
    //   this.onlineUsers$.pipe(take(1)).subscribe((usernames) => {
    //     this.onlineUsersSource.next([...usernames, username]);
    //   });
    //   this._toastr.info(`${username} is online`);
    // });

    // this.hubConnection.on('UserIsOffline', (username) => {
    //   this.onlineUsers$.pipe(take(1)).subscribe((usernames) => {
    //     this.onlineUsersSource.next([
    //       ...usernames.filter((x) => x !== username),
    //     ]);
    //   });
    //   this._toastr.warning(`${username} logged off`);
    // });

    // this.hubConnection.on('GetOnlineUsers', (usernames: string[]) => {
    //   this.onlineUsersSource.next(usernames);
    // });

    this.hubConnection.on('NewMessageReceived', ({ username }) => {
      this._messageService.numberOfUnreadMessages++;

      this._toastr
        .info('You have a new message')
        .onTap.pipe(take(1))
        .subscribe(() => {
          if (this._router.url === '/user/messages') {
            location.reload();
          } else {
            this._router.navigateByUrl('/user/messages');
          }
        });
    });
  }

  stopHubConnection() {
    this.hubConnection.stop().catch((error) => console.log(error));
  }
}
