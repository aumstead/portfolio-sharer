import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})
export class MessageComponent implements OnInit {
  @Input() container: string;
  @Input() message: Message;
  @Input() deleteMessage;
  @Input() messages: Message[];
  replyMode: boolean = false;
  deleteMode: boolean = false;
  messageContent: string;
  @ViewChild('messageForm') messageForm: NgForm;

  constructor(private _messageService: MessageService) {}

  ngOnInit(): void {}

  setReplyMode(val: boolean) {
    this.replyMode = val;
  }

  setDeleteMode(val: boolean) {
    this.deleteMode = val;
  }

  sendMessage() {
    this._messageService
      .sendMessage(this.message.senderUsername, this.messageContent)
      .subscribe((message) => {
        // this.messages.push(message);
        this.messageForm.reset();
        this.replyMode = false;
      });
  }
}
