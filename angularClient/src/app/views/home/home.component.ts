import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    public _accountService: AccountService,
    private _router: Router
  ) {}

  ngOnInit(): void {}

  demoLogin = { username: 'pete', password: 'Gandalf1' };

  login() {
    this._accountService.login(this.demoLogin).subscribe(
      () => {
        this._router.navigateByUrl('/browse');
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
