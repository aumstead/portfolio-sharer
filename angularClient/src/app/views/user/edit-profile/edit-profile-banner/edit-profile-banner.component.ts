import { Component, Input, OnInit } from '@angular/core';
import { AppUser } from 'src/app/_models/appUser';

@Component({
  selector: 'app-edit-profile-banner',
  templateUrl: './edit-profile-banner.component.html',
  styleUrls: ['./edit-profile-banner.component.css'],
})
export class EditProfileBannerComponent implements OnInit {
  @Input() pageUser: AppUser;

  constructor() {}

  ngOnInit(): void {}
}
