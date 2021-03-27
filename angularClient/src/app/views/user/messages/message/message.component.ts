import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { LoggedInUser } from 'src/app/_models/loggedInUser';
import { Message } from 'src/app/_models/message';
import { AccountService } from 'src/app/_services/account.service';
import { MessageService } from 'src/app/_services/message.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})
export class MessageComponent implements OnInit, OnDestroy {
  @Input() container: string;
  @Input() message: Message;
  @Input() deleteMessage;
  @Input() messages: Message[];
  replyMode: boolean = false;
  deleteMode: boolean = false;
  messageContent: string;
  @ViewChild('messageForm') messageForm: NgForm;
  loggedInUser: LoggedInUser;

  constructor(private _messageService: MessageService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this._messageService.stopHubConnection();
  }

  setReplyMode(val: boolean) {
    this.replyMode = val;
  }

  setDeleteMode(val: boolean) {
    this.deleteMode = val;
  }

  markAsRead(id: number) {
    if (this.message.dateRead === null) {
      this.message.dateRead = new Date();
      this._messageService.markAsRead(id).subscribe(() => {
        this._messageService.numberOfUnreadMessages--;
      });
    }
  }

  // markAsUnread(id: number) {
  //   if (this.message.dateRead !== null) {
  //     this.message.dateRead = null;
  //     this._messageService.markAsUnread(id).subscribe(() => {
  //       this._messageService.numberOfUnreadMessages++;
  //     });
  //   }
  // }
}
