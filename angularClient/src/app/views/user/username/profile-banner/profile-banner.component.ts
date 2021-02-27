import { Component, Input, OnInit } from '@angular/core';
import { AppUser } from 'src/app/_models/appUser';

@Component({
  selector: 'app-profile-banner',
  templateUrl: './profile-banner.component.html',
  styleUrls: ['./profile-banner.component.css'],
})
export class ProfileBannerComponent implements OnInit {
  @Input() pageUser: AppUser;
  constructor() {}

  ngOnInit(): void {}
}
