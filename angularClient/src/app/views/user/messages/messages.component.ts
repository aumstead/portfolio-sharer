import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { LoggedInUser } from 'src/app/_models/loggedInUser';
import { Message } from 'src/app/_models/message';
import { Pagination } from 'src/app/_models/pagination';
import { AccountService } from 'src/app/_services/account.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  container = 'unread';
  pageNumber = 1;
  pageSize = 5;
  loading = false;
  loggedInUser: LoggedInUser;

  constructor(
    private _messageService: MessageService,
    private _accountService: AccountService
  ) {
    this._accountService.currentUser$
      .pipe(take(1))
      .subscribe((user) => (this.loggedInUser = user));
  }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    // this.loading = true;
    this._messageService
      .getMessages(this.pageNumber, this.pageSize, this.container)
      .subscribe((response) => {
        console.log('in subscribe. response:', response);
        this.messages = response.result;
        this.pagination = response.pagination;
        // this.loading = false;
      });
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    console.log('in pageChanged. pageNumber:', this.pageNumber);
    this.loadMessages();
  }

  deleteMessage(id: number) {
    this._messageService.deleteMessage(id).subscribe(() => {
      this.messages.splice(
        this.messages.findIndex((m) => m.id === id),
        1
      );
    });
  }
}
