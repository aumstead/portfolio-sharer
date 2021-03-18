import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.css'],
})
export class ThreadComponent implements OnInit {
  username: string;
  messages: Message[];
  messageContent;
  @ViewChild('messageForm') messageForm: NgForm;

  constructor(
    private _messageService: MessageService,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.username = this._route.snapshot.paramMap.get('username');
    this.loadMessages();
  }

  loadMessages() {
    this._messageService
      .getMessageThread(this.username)
      .subscribe((messages) => {
        this.messages = messages;
      });
  }

  sendMessage() {
    this._messageService
      .sendMessage(this.username, this.messageContent)
      .subscribe((message) => {
        this.messages.push(message);
        this.messageForm.reset();
      });
  }
}
