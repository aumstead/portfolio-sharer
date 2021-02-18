import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { LoginErrors } from 'src/app/_models/loginErrors';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  model: any = {};
  errors: LoginErrors = { username: false, password: false };
  constructor(public accountService: AccountService, private router: Router) {}
  ngOnInit(): void {}

  login() {
    this.errors = { username: false, password: false };
    this.accountService.login(this.model).subscribe(
      () => {
        this.router.navigateByUrl('/feed');
      },
      (error) => {
        if (error.error.type === 'username') {
          this.errors.username = true;
        } else if (error.error.type === 'password') {
          this.errors.password = true;
        }
      }
    );
  }
}
