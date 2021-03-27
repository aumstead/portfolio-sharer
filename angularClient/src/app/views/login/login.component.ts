import { Component, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginErrors } from 'src/app/_models/loginErrors';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  validationErrors: string[] = [];
  errors: LoginErrors = { username: false, password: false };

  constructor(
    public accountService: AccountService,
    private router: Router,
    private _fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  login() {
    this.errors = { username: false, password: false };
    this.accountService.login(this.loginForm.value).subscribe(
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

  initializeForm() {
    this.loginForm = this._fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(16),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
}
