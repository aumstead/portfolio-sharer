import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppUser } from 'src/app/_models/appUser';
import { FollowService } from 'src/app/_services/follow.service';

@Component({
  selector: 'app-profile-banner',
  templateUrl: './profile-banner.component.html',
  styleUrls: ['./profile-banner.component.css'],
})
export class ProfileBannerComponent implements OnInit {
  @Input() pageUser: AppUser;
  @Input() loggedInUser: AppUser;
  isFollowing: boolean = null;

  constructor(
    private _followService: FollowService,
    private _toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this._followService.getFollows('following').subscribe((response) => {
      for (const property in response) {
        if (response[property] === this.pageUser.username) {
          this.isFollowing = true;
        }
      }
      if (this.isFollowing === null) {
        this.isFollowing = false;
      }
    });
  }

  addFollow(pageUser: AppUser) {
    this._followService.addFollow(pageUser.username).subscribe(() => {
      this._toastr.success(`Following ${pageUser.username}`);
      this._followService.followingCache.push(pageUser.username);
      this.isFollowing = true;
    });
  }

  removeFollow(pageUser: AppUser) {
    this._followService.removeFollow(pageUser.id).subscribe(() => {
      this._toastr.success(`Unfollowed ${pageUser.username}`);
      const idx = this._followService.followingCache.indexOf(pageUser.username);
      this._followService.followingCache.splice(idx, 1);
      this.isFollowing = false;
    });
  }
}
