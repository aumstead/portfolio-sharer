import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Message } from '../_models/message';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { AppUser } from '../_models/appUser';
import { BehaviorSubject } from 'rxjs';
import { LoggedInUser } from '../_models/loggedInUser';
import { take } from 'rxjs/operators';
import { PresenceService } from './presence.service';
import { Group } from '../_models/group';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  baseUrl = environment.apiUrl;
  hubUrl = environment.hubUrl;
  private hubConnection: HubConnection;
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();
  numberOfUnreadMessages: number;
  connectingToHub = false;

  constructor(
    private _http: HttpClient,
    private _loadingService: LoadingService
  ) {}

  createHubConnection(loggedInUser: LoggedInUser, otherUsername: string) {
    this._loadingService.loading();
    this.connectingToHub = true;
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this.hubUrl}/message?user=${otherUsername}`, {
        accessTokenFactory: () => loggedInUser.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .catch((error) => console.log(error))
      .finally(() => {
        this._loadingService.idle();
        this.connectingToHub = false;
      });

    this.hubConnection.on('ReceiveMessageThread', (messages) => {
      this.messageThreadSource.next(messages);
    });

    this.hubConnection.on('NewMessage', (message) => {
      this.messageThread$.pipe(take(1)).subscribe((messages) => {
        this.messageThreadSource.next([...messages, message]);
      });
    });

    this.hubConnection.on('UpdatedGroup', (group: Group) => {
      if (group.connections.some((x) => x.username === otherUsername)) {
        this.messageThread$.pipe(take(1)).subscribe((messages) => {
          messages.forEach((message) => {
            if (!message.dateRead) {
              message.dateRead = new Date(Date.now());
            }
          });
          this.messageThreadSource.next([...messages]);
        });
      }
    });
  }

  stopHubConnection() {
    if (this.hubConnection) {
      this.messageThreadSource.next([]);
      this.hubConnection.stop();
    }
  }

  getMessages(pageNumber, pageSize, container) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);
    return getPaginatedResult<Message[]>(
      `${this.baseUrl}/messages`,
      params,
      this._http
    );
  }

  getUnreadMessages() {
    return this._http.get(`${this.baseUrl}/messages/unread`);
  }

  // getMessageThread(username: string) {
  //   return this._http.get<Message[]>(
  //     `${this.baseUrl}/messages/thread/${username}`
  //   );
  // }

  async sendChatMessage(username: string, content: string) {
    return this.hubConnection
      .invoke('SendMessage', {
        recipientUsername: username,
        content,
      })
      .catch((error) => console.log(error));
  }

  markAsRead(id: number) {
    return this._http.put(`${this.baseUrl}/messages/read/${id}`, {});
  }

  // markAsUnread(id: number) {
  //   return this._http.put(`${this.baseUrl}/messages/unread/${id}`, {});
  // }

  deleteMessage(id: number) {
    return this._http.delete(`${this.baseUrl}/messages/${id}`);
  }
}
