import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { LoggedInUser } from 'src/app/_models/loggedInUser';
import { Message } from 'src/app/_models/message';
import { AccountService } from 'src/app/_services/account.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.css'],
})
export class ThreadComponent implements OnInit, OnDestroy {
  username: string;
  messages: Message[];
  messageContent;
  @ViewChild('messageForm') messageForm: NgForm;
  loggedInUser: LoggedInUser;
  loading = false;

  constructor(
    public _messageService: MessageService,
    private _route: ActivatedRoute,
    private _accountService: AccountService
  ) {
    this._accountService.currentUser$
      .pipe(take(1))
      .subscribe((user) => (this.loggedInUser = user));
  }
  ngOnDestroy(): void {
    this._messageService.stopHubConnection();
  }

  ngOnInit(): void {
    this.username = this._route.snapshot.paramMap.get('username');
    // this.loadMessages();
    this._messageService.createHubConnection(this.loggedInUser, this.username);
  }

  // loadMessages() {
  //   this._messageService
  //     .getMessageThread(this.username)
  //     .subscribe((messages) => {
  //       this.messages = messages;
  //     });
  // }

  sendMessage() {
    this.loading = true;
    this._messageService
      .sendChatMessage(this.username, this.messageContent)
      .then(() => {
        this.messageForm.reset();
      })
      .finally(() => (this.loading = false));
  }
}
