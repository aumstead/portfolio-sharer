import { Component, Input, OnInit } from '@angular/core';
import { AppUser } from 'src/app/_models/appUser';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css'],
})
export class UserCardComponent implements OnInit {
  @Input() appUser: AppUser;

  constructor() {}

  ngOnInit(): void {}
}
